import unittest
from Crypto.PublicKey import RSA, ECC
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Signature import eddsa
import os
import pickle
import sys

# Setting path, to import IoTServer.py.
sys.path.append('../IoTServer/')
import IoTServer

cwd = os.path.dirname(os.path.realpath(__file__))

TOKEN = b"<TRACK2GATHER>"
SIG_BYTES = 64

# Directory containing all keys for unit testing.
testKeysDirectory = f"{cwd}/TestKeys/"

correct_payload_dict = pickle.load(open(f"test_payload1.pickle", "rb" ))
wrong_payload_dict = pickle.load(open(f"test_payload2.pickle", "rb" ))

################### Helpers ####################
def encryptWithServerTestPublicKey(data):
    publicKeyFile = "serverPubKey.pem"
    f = open(f'{testKeysDirectory}{publicKeyFile}','rb')
    key = RSA.import_key(f.read())
    cipher = PKCS1_OAEP.new(key)
    encryptedPayload = cipher.encrypt(data)
    return encryptedPayload

def encryptWithPublicKey(pubkey, data):
    randomPubKey = RSA.import_key(pubkey)
    cipher = PKCS1_OAEP.new(randomPubKey)
    payload = cipher.encrypt(data)
    return payload

def generateRandomPublicKey():
    private_key = RSA.generate(4096)
    privateKey = private_key.export_key()
    publicKey = private_key.publickey().exportKey()
    return publicKey

def getCorrectLayer2Payload():
    encrypted = correct_payload_dict['ct']
    symmetricKey = correct_payload_dict['secretKey']
    iv = correct_payload_dict['iv']
    tag = correct_payload_dict['tag']
    mac = correct_payload_dict['mac']
    location = correct_payload_dict['location']
    currTime = correct_payload_dict['currTime']

    layerTwoPayload = encrypted + TOKEN + symmetricKey + TOKEN + iv + TOKEN + tag + TOKEN + mac + TOKEN + location + TOKEN + currTime
    return layerTwoPayload

def getLayer2PayloadWithDifferentSymmetricKey():
    encrypted = correct_payload_dict['ct']
    symmetricKey = wrong_payload_dict['secretKey']
    iv = correct_payload_dict['iv']
    tag = correct_payload_dict['tag']
    mac = correct_payload_dict['mac']
    location = correct_payload_dict['location']
    currTime = correct_payload_dict['currTime']

    layerTwoPayload = encrypted + TOKEN + symmetricKey + TOKEN + iv + TOKEN + tag + TOKEN + mac + TOKEN + location + TOKEN + currTime
    return layerTwoPayload
################################################

# Manual declaration of method, because actual implemented methods uses the "production" directories in the respective methods.
def decryptWithServerTestPrivateKey(encryptedPayload):
    privKeyFile = "serverPrivKey.pem"
    f = open(f'{testKeysDirectory}{privKeyFile}','rb')
    key = RSA.import_key(f.read())
    cipher = PKCS1_OAEP.new(key)
    layerTwoPayload = cipher.decrypt(encryptedPayload)
    return layerTwoPayload

class TestIoTServer(unittest.TestCase):
    '''
    Tests if layer 1 decryption with corresponding Server Private Key works properly.
    This should assert to true.
    '''
    def testDecryptWithServerPrivateKey(self):
        expectedOutput = b"Testing layer 1 decryption"
        # Simulate encryption/decryption of message.
        encrypted = encryptWithServerTestPublicKey(expectedOutput)
        decrypted = decryptWithServerTestPrivateKey(encrypted)
        self.assertEqual(expectedOutput, decrypted)
    '''
    Tests if layer 1 decryption fails if payload is encrypted with mismatched private key.
    '''
    def testDecryptWithMismatchedPrivateKey(self):
        expectedOutput = b"Testing layer 1 decryption"
        randomPubKey = generateRandomPublicKey()
        encrypted = encryptWithPublicKey(randomPubKey, expectedOutput)
        with self.assertRaises(ValueError) as ctx:
            decrypted = decryptWithServerTestPrivateKey(encrypted)
        self.assertEqual("Incorrect decryption.", str(ctx.exception))
    '''
    Tests if layer 2 decryption with the embedded symmetric works properly.
    '''
    def testDecryptWithSymmetricKey(self):
        # To simulate decryption of a layer 2 payload.
        layerTwoPayload = getCorrectLayer2Payload()
        obtainedMac, decryptedPayload, obtainedLocation, obtainedTime = IoTServer.decryptWithSymmetricKey(layerTwoPayload)

        # Expected Data and signature values.
        data = correct_payload_dict['data']
        signature = correct_payload_dict['signature']

        self.assertEqual(correct_payload_dict['location'], obtainedLocation)
        self.assertEqual(correct_payload_dict['mac'], obtainedMac)
        self.assertEqual(correct_payload_dict['currTime'], obtainedTime)
        self.assertEqual(signature + data, decryptedPayload)
    '''
    Tests if layer 2 decryption fails when provided a different/invalid symmetric key.
    '''
    def testDecryptWthDifferentSymmetricKey(self):
        layerTwoPayload = getLayer2PayloadWithDifferentSymmetricKey()

        with self.assertRaises(ValueError) as ctx:
            obtainedMac, decryptedPayload, obtainedLocation, obtainedTime = IoTServer.decryptWithSymmetricKey(layerTwoPayload)

        self.assertEqual("MAC check failed", str(ctx.exception))
    '''
    Tests if Digital Signature verifies successfully.
    '''
    def testVerifyValidDigitalSignature(self):
        # Contains both the digital signature and the actual data.
        payload = correct_payload_dict['pt']
        mac_address = correct_payload_dict['mac'].decode()
        self.assertTrue(IoTServer.verifySignature(payload, testKeysDirectory, mac_address.replace(":", "") + ".pem"), True)
    '''
    Tests if Digital Signature verification fails with an invalid signature.
    '''
    def testVerifyInvalidDigitalSignature(self):
        # Contains the invalid digital signature
        data = correct_payload_dict['data']
        signature = wrong_payload_dict['signature']
        payload = data + signature
        mac_address = correct_payload_dict['mac'].decode()
        self.assertFalse(IoTServer.verifySignature(payload, testKeysDirectory, mac_address.replace(":", "") + ".pem"))
