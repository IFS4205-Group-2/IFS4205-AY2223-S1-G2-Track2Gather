import pysftp, os, sys
import config
from Crypto.PublicKey import ECC
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

cwd = os.path.dirname(os.path.realpath(__file__))
serverDirectory = f"{cwd}/ServerGenKeys/"

'''
Generates the directories for storing the public-private key pair.
'''
def generateDirectory():
    print("Generating Directory...")
    for dir in [serverDirectory]:
        if not os.path.exists(f"{dir}"):
            os.makedirs(dir)
            print(f"{dir} has been created.")
        else:
            print(f"{dir} already exists.")

def printKeyAsIntArray(filename):
    keyPem = b''
    with open(serverDirectory + filename, 'r') as f:
        keyPem = f.read()
    key = ECC.import_key(keyPem)
    keyStr = key.export_key(format='raw')
    print('{', end="")
    for i, key in enumerate(keyStr):
        if i == len(keyStr) - 1:
            print(key, end='}\n')
        else:
            print(key, end=', ')

"""
Print private keys, not supported in PyCryptodome
"""
def printPrivateKeyAsIntArray(filename):
    keyPem = b''
    with open(serverDirectory + filename, 'rb') as f:
        keyPem = f.read()
    key = load_pem_private_key(keyPem, None, default_backend())
    keyStr = key.private_bytes(
        encoding=serialization.Encoding.Raw, 
        format=serialization.PrivateFormat.Raw, 
        encryption_algorithm=serialization.NoEncryption()
    )
    print('{', end="")
    for i, key in enumerate(keyStr):
        if i == len(keyStr) - 1:
            print(key, end='}\n')
        else:
            print(key, end=', ')
    

# Replace with address of NUS net/local IoT Server VM.
sftpServer = config.ip

generateDirectory()
print("Retrieving Keys from Server...")
with pysftp.Connection(sftpServer, username=config.sftp_user, password=config.sftp_password) as sftp:
    # To get files from server.
    with sftp.cd('/Server'):           # Replace with Server Directory
        sftp.get('serverPubKey.pem', f"{cwd}/ServerGenKeys/serverPubKey.pem")         # get a remote file
print("Retrieved serverPubKey.pem")

with pysftp.Connection(sftpServer, username=config.sftp_user, password=config.sftp_password) as sftp:
    with sftp.cd('/ServerGenKeys'):           # Replace with Server Directory
        for filename in ['recvPrivateKey.pem', 'recvPublicKey.pem']:
            sftp.get(filename, f"{cwd}/ServerGenKeys/{filename}") 
            print("Retrieved " + filename)

if len(sys.argv) > 1 and sys.argv[1] == "--all":
    with pysftp.Connection(sftpServer, username=config.sftp_user, password=config.sftp_password) as sftp:
        with sftp.cd('/ServerGenKeys'):           # Replace with Server Directory
            for filename in ['defaultPrivateKey.pem', 'defaultPublicKey.pem']:
                sftp.get(filename, f"{cwd}/ServerGenKeys/{filename}") 
                print("Retrieved " + filename)

    print("...................................................................")
    # Implement printing and deleting of default keys
    print("Please copy this private key into the Arduino code, variable def_pri_key:")
    printPrivateKeyAsIntArray('defaultPrivateKey.pem')
    print("...................................................................")

    print("Please copy this public key into the Arduino code, variable def_pub_key:")
    printKeyAsIntArray('defaultPublicKey.pem')
    print("...................................................................")

    print("Please copy this public key into the Arduino code, variable verify_recv_key:")
    printKeyAsIntArray('recvPublicKey.pem')
    print("...................................................................")

    if os.path.isfile(f"{cwd}/ServerGenKeys/defaultPrivateKey.pem"):
        os.remove(f"{cwd}/ServerGenKeys/defaultPrivateKey.pem")



