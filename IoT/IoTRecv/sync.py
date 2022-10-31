from adafruit_ble import BLERadio
from adafruit_ble.advertising.standard import ProvideServicesAdvertisement
from adafruit_ble.services.gmsservice import GMS
from Crypto.PublicKey import ECC
from Crypto.Signature import eddsa
import os
import pysftp
import config

SIG_BYTES = 64

cwd = os.path.dirname(os.path.realpath(__file__))

# Replace with address of NUS net/local IoT Server VM.
sftpServer = config.ip

serverDirectory = f"{cwd}/ServerGenKeys/"

ble = BLERadio()

GMS_connection = None

found = config.mac_dict

'''
Generates the directory for storing the public-private key pair.
'''
def generateDirectory():
    print("Generating Directory...")
    if not os.path.exists(f"{serverDirectory}"):
        os.makedirs(dir)
        print(f"{serverDirectory} has been created.")
    else:
        print(f"{serverDirectory} already exists.")


"""
Instantiate the bootstrapped public key in IoT Dongle
"""
def setup():
    pub_pem = b''
    with open(serverDirectory+"defaultPublicKey.pem", "r") as f:
        pub_pem = f.read()
    pubSignKey = ECC.import_key(pub_pem)

    verifier = eddsa.new(pubSignKey, mode='rfc8032')
    return verifier

"""
Use the bootstrapped public key to verify the signature
Retrieve the generated public key of the IoT Dongle in clear
"""
def receiveAndVerifyPublicKey(GMS_connection, verifier):
    GMS_service = GMS_connection[GMS]
    GMS_service.write(b"sync")
    try:
        msg = GMS_service.read(256).rstrip(b'\x00')
        signature = msg[:SIG_BYTES]
        publicKey = msg[SIG_BYTES:]
        verifier.verify(publicKey, signature)
    except (ValueError, AttributeError) as e:
        raise Exception("Packet Error")
    return publicKey

"""
Save the generated public key of the IoT Dongle in PEM format
"""
def writeToPEM(publicKey, mac):
    donglePublicKey = eddsa.import_public_key(publicKey)
    pubKeyPem = donglePublicKey.export_key(format='PEM')
    filename = mac.replace(":", "") + ".pem"
    with open(serverDirectory + filename, 'w') as f:
        f.write(pubKeyPem)

    with pysftp.Connection(sftpServer, username=config.sftp_user, password=config.sftp_password) as sftp:
        # To store/upload files to server.
        with sftp.cd('/Dongles'):
            sftp.put(serverDirectory + filename)
            print("Sent to IoT Server")

    if os.path.isfile(serverDirectory + filename):
        os.remove(serverDirectory + filename)

def connectToDongle(GMS_connection, mac, verifier):
    if GMS_connection and GMS_connection.connected:
        publicKey = receiveAndVerifyPublicKey(GMS_connection, verifier)
        writeToPEM(publicKey, mac)
    GMS_connection.disconnect()

def startScan(verifier):
    print("Scanning for 30 seconds...")
    for adv in ble.start_scan(ProvideServicesAdvertisement, minimum_rssi=-95, timeout=30):
        if GMS in adv.services:
            mac = adv.address.string
            try:
                if found[mac] == False:
                    print(mac)
                    found[mac] = True
                    try:
                        GMS_connection = ble.connect(adv)
                        connectToDongle(GMS_connection, mac, verifier)
                    except KeyboardInterrupt:
                        if GMS_connection and GMS_connection.connected:
                            GMS_connection.disconnect()
                        ble.stop_scan()
                        exit()
                    except:
                        print("Failed to retrieve key, retrying...")
                        found[mac] = False
                        if GMS_connection and GMS_connection.connected:
                            GMS_connection.disconnect()
            except:
                pass
        if all(value == True for value in found.values()):
            break
    if any(value == False for value in found.values()):
        for mac in found.keys():
            if found[mac] == False:
                print(f"{mac} was not found in the scan. If this mac address is to be synced, please try again.")
    ble.stop_scan()

def exitScan():
    print("Finished retrieving IoT Dongle's public key.")
    print("...................................................................")

def main():
    generateDirectory()
    verifier = setup()
    startScan(verifier)
    exitScan()

if __name__ == "__main__":
    main()





        