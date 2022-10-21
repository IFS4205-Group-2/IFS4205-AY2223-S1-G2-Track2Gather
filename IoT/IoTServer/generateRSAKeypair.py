from Crypto.PublicKey import RSA
from Crypto.PublicKey import ECC
import os

cwd = os.path.dirname(os.path.realpath(__file__))

# Directory used to hold files to be copied to SFTP directory.
shareDirectory = f"{cwd}/Share/"

# Will be moved to another directory when on actual system.
secretDirectory = f"{cwd}/Secret/"

# Directory used to store the ED25519 key pairs generated.
serverDirectory = f"{cwd}/ServerGenKeys/"

serverRSAPrivKeyFile = "serverPrivKey.pem"
serverRSAPubKeyFile = "serverPubKey.pem"

'''
Generates the Share Directory for storing
the server's RSA public key which would be copied
to the SFTP directory.
'''
def generateShareDirectory():
    if not os.path.exists(f"{shareDirectory}"):
        os.makedirs(shareDirectory)
        print(f"{shareDirectory} has been created.")
    else:
        print(f"{shareDirectory} already exists.")

'''
Generates the Secret Directory for storing
the server's RSA private key.
'''
def generateSecretDirectory():
    if not os.path.exists(f"{secretDirectory}"):
        os.makedirs(secretDirectory)
        print(f"{secretDirectory} has been created.")
    else:
        print(f"{secretDirectory} already exists.")

'''
Generates the Server Directory for storing generated
ED25519 key pairs.
'''
def generateServerDirectory():
    if not os.path.exists(f"{serverDirectory}"):
        os.makedirs(serverDirectory)
        print(f"{serverDirectory} has been created.")
    else:
        print(f"{serverDirectory} already exists.")

'''
Generates the directories for storing the public-private key pair.
'''
def generateDirectories():
    print("Generating Directories...")
    generateShareDirectory()
    generateSecretDirectory()
    generateServerDirectory()

'''
Generates the RSA private-public key pair for the IoT Server.
'''
def generateRSAKeyPair():
    private_key = RSA.generate(4096)
    pubkey = private_key.publickey()

    f = open(f"{secretDirectory}{serverRSAPrivKeyFile}", 'wb')
    privateKey = private_key.export_key()
    f.write(privateKey)
    f.close()

    f = open(f"{shareDirectory}{serverRSAPubKeyFile}", 'wb')
    publicKey = private_key.publickey().exportKey()
    f.write(publicKey)
    f.close()

'''
Generate ED25519 keypairs, used for signing and verification.
'''
def generateED25519KeyPair(purpose):
    privateKey = ECC.generate(curve="ed25519")
    publicKey = privateKey.public_key()

    priKeyPem = privateKey.export_key(format='PEM')
    with open(serverDirectory + purpose + "PrivateKey.pem", 'w') as f:
        f.write(priKeyPem)

    pubKeyPem = publicKey.export_key(format='PEM')
    with open(serverDirectory + purpose + "PublicKey.pem", 'w') as f:
        f.write(pubKeyPem)

'''
Checks if the ED25519 key pair exists on the system.
'''
def checkIfED25519KeyPairExists(purpose):
    if os.path.exists(f"{serverDirectory}{purpose}PublicKey.pem") and os.path.exists(f"{serverDirectory}{purpose}PrivateKey.pem"):
        print(f"The {purpose} Keypair already exists.")
        return True
    return False

'''
Checks if the RSA key pair exists on the system.
'''
def checkIfRSAKeyPairExists():
    if os.path.exists(f"{secretDirectory}{serverRSAPrivKeyFile}") and os.path.exists(f"{shareDirectory}{serverRSAPubKeyFile}"):
        print("The Server's RSA Keypair already exists.")
        return True
    return False

'''
Prints the good bye message.
'''
def goodbye():
    print("Finished creating the required directories.")
    print("Finished setting up IoT Server's RSA key pair and ED25519 key pairs.")
    print("Goodbye.")
    print("...................................................................")

def main():
    generateDirectories()
    if not checkIfRSAKeyPairExists():
        generateRSAKeyPair()
    if not checkIfED25519KeyPairExists("recv"):
        generateED25519KeyPair("recv")
    if not checkIfED25519KeyPairExists("default"):
        generateED25519KeyPair("default")
    goodbye()


if __name__ == "__main__":
    main()
