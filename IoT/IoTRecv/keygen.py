from Crypto.PublicKey import ECC
from Crypto.Signature import eddsa
import os

cwd = os.path.dirname(os.path.realpath(__file__))
serverDirectory = f"{cwd}/ServerGenKeys/"

'''
Generates the directories for storing the public-private key pair.
'''
def generateDirectories():
    print("Generating Directories...")
    if not os.path.exists(f"{serverDirectory}"):
        os.makedirs(serverDirectory)
        print(f"{serverDirectory} has been created.")
    else:
        print(f"{serverDirectory} already exists.")

"""
Generate ED25519 keypairs, used for signing and verification.
"""
def generateKeyPair(purpose):
    message = b"hello"

    privateKey = ECC.generate(curve="ed25519")
    publicKey = privateKey.public_key()

    signer = eddsa.new(privateKey, mode='rfc8032')
    sig = signer.sign(message)

    verifier = eddsa.new(publicKey, mode='rfc8032')
    try:
        verifier.verify(message, sig)
        print("The message is authentic")
    except ValueError:
        print("The message is not authentic")

    priKeyPem = privateKey.export_key(format='PEM')

    with open(serverDirectory + purpose + "PrivateKey.pem", 'w') as f:
        f.write(priKeyPem)

    pubKeyPem = publicKey.export_key(format='PEM')

    with open(serverDirectory + purpose + "PublicKey.pem", 'w') as f:
        f.write(pubKeyPem)

"""
For manual copying to arduino code
"""
def printKeyAsIntArray(filename):
    pubKeyPem = b''
    with open(serverDirectory + filename, 'r') as f:
        pubKeyPem = f.read()
    pubKey = ECC.import_key(pubKeyPem)
    pubKeyStr = pubKey.export_key(format="raw")
    for i in pubKeyStr:
        print(i, end=', ')

generateDirectories()
generateKeyPair("recv")
generateKeyPair("default")