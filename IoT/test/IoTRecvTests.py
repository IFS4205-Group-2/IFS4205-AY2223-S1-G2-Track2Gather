import unittest, sys
from ecdsa import curves
from ecdsa.keys import SigningKey, VerifyingKey, MalformedPointError, BadSignatureError
import pickle
from Crypto.PublicKey import ECC, RSA
from Crypto.Signature import eddsa
from Crypto.Cipher import AES, PKCS1_OAEP

correct_payload_dict = pickle.load(open("test_payload1.pickle", "rb" ))
wrong_payload_dict = pickle.load(open("test_payload2.pickle", "rb" ))

sys.path.append('../IoTRecv/')
import IoTRecv


"""
dictionary_structure: {
    'payload': b'Dongle encrypted payload', 
    'ct': b'Split Ciphertext', 
    'iv': b'IV used for the encryption', 
    'tag': b'Tag generated using AES GCM', 
    'donglePublicKey': b'The ephemeral public key from dongle used to generate symmetric key', 
    'recvPublicKey': b'The ephemeral public key from recv used to generate symmetric key', 
    'recvPrivateKey': b'The ephemeral private key from recv used to generate symmetric key', 
    'secretKey': b'Symmetric Key generated from the ephemeral keypairs', 
    'pt': b'data + signature', 
    'signature': b'signature of the dongle from the data', 
    'data': b'data sent (RSSI)',
    'mac' : b'mac address of dongle', 
    'location': b'location of recv',
    'encryptedPayload': b'Recv encrypted payload with server public key',
    'recvSignature': b'Recv signature of the constructed payload',
    'currTime': b'current_time'
    }
"""

def writeToDongleStub(pubKey, signer):
    pubKeyBytes = pubKey.to_string()
    sig = signer.sign(pubKeyBytes)
    return sig
    

class TestRecv(unittest.TestCase):
    """
    Tests if IoT Recv is able to setup the keys for encrypting and signing.
    """
    def test_setup_sucess(self):
        try:
            testKey, testSigner = IoTRecv.setup("TestKeys/")
        except:
            self.fail("Setup failed")
        self.assertIsInstance(testKey, RSA.RsaKey)
        self.assertIsInstance(testSigner, eddsa.EdDSASigScheme)

    """
    Tests if setting up IoT Recv fails if the directory/file of the keys do not exist
    """
    def test_setup_failure(self):
        self.assertRaises(FileNotFoundError, IoTRecv.setup, "WrongDir/")

    """
    Tests if the symmetric key generated is correct 
    """
    def test_symkey_success(self):
        donglePublicKey = correct_payload_dict['donglePublicKey']
        recvPrivateKey = correct_payload_dict['recvPrivateKey']
        privKey = SigningKey.from_string(recvPrivateKey, curves.SECP160r1)
        pubKey = VerifyingKey.from_string(donglePublicKey, curves.SECP160r1)
        secretKey = IoTRecv.generateSymKey(pubKey, privKey)
        self.assertEqual(correct_payload_dict['secretKey'], secretKey)

    def test_symkey_failure(self):
        donglePublicKey = wrong_payload_dict['donglePublicKey']
        recvPrivateKey = wrong_payload_dict['recvPrivateKey']
        privKey = SigningKey.from_string(recvPrivateKey, curves.SECP160r1)
        pubKey = VerifyingKey.from_string(donglePublicKey, curves.SECP160r1)
        secretKey = IoTRecv.generateSymKey(pubKey, privKey)
        self.assertNotEqual(correct_payload_dict['secretKey'], secretKey)

    """
    Tests if IoT Recv is able to split the message from the Dongle
    """
    def test_split_msg_success(self):
        test_iv, test_tag, test_donglePubKey, test_ct = IoTRecv.splitMsg(correct_payload_dict['payload'])
        self.assertEqual(test_iv, correct_payload_dict['iv'])
        self.assertEqual(test_tag, correct_payload_dict['tag'])
        self.assertEqual(test_donglePubKey.to_string(), correct_payload_dict['donglePublicKey'])
        self.assertEqual(test_ct, correct_payload_dict['ct'])
    def test_split_msg_failure(self):
        test_iv, test_tag, test_donglePubKey, test_ct = IoTRecv.splitMsg(wrong_payload_dict['payload'])
        self.assertNotEqual(test_iv, correct_payload_dict['iv'])
        self.assertNotEqual(test_tag, correct_payload_dict['tag'])
        self.assertNotEqual(test_donglePubKey.to_string(), correct_payload_dict['donglePublicKey'])
        self.assertNotEqual(test_ct, correct_payload_dict['ct'])
    def test_split_msg_None_msg(self):
        self.assertRaises(TypeError, IoTRecv.splitMsg, None)
    def test_split_msg_invalid_length(self):
        self.assertRaises(MalformedPointError, IoTRecv.splitMsg, b'toosmall')
    
    """
    Tests if IoT Recv is able to construct the payload correctly
    """
    def test_construct_payload_success(self):
        serverPubKey, signer = IoTRecv.setup('TestKeys/')
        payload = IoTRecv.constructPayload(correct_payload_dict['ct'], correct_payload_dict['secretKey'], correct_payload_dict['iv'], 
                                correct_payload_dict['tag'], correct_payload_dict['mac'].decode(), serverPubKey, signer)
        with open('TestKeys/serverPrivKey.pem', 'rb') as f:
            key = RSA.import_key(f.read())
            cipher = PKCS1_OAEP.new(key)
            try:
                cipher.decrypt(payload)
            except:
                self.fail("constructPayload failed.")
                
    def test_write_to_dongle_success(self):
        serverPubKey, signer = IoTRecv.setup('TestKeys/')
        privKey = SigningKey.generate(curves.SECP160r1)
        pubKey = privKey.verifying_key
        recvPubPem = b''
        with open('TestKeys/recvPublicKey.pem', 'r') as f:
            recvPubPem = f.read()
            recvPubKey = ECC.import_key(recvPubPem)
        verifier = eddsa.new(recvPubKey, mode='rfc8032')
        sig = writeToDongleStub(pubKey, signer)
        try:
            verifier.verify(pubKey.to_string(), sig)
        except BadSignatureError:
            self.fail("Bad Signature")
        except:
            self.fail("Uncaught Exception")
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        


