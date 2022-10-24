from logtail import LogtailHandler
import config
import logging
import socket, os, sys
import psycopg2
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA, ECC
from Crypto.Signature import DSS, eddsa
from Crypto.Hash import SHA256

handler = LogtailHandler(source_token=config.source_token)

logger = logging.getLogger(__name__)
logger.handlers = []
logger.setLevel(logging.INFO)
logger.addHandler(handler)

cwd = os.path.dirname(os.path.realpath(__file__))

sftp_home = "/home/sftp"

secretDirectory = f"{cwd}/Secret/"

donglesDirectory = f"{sftp_home}/Dongles/"
serverGenDirectory = f"{sftp_home}/ServerGenKeys/"

LPORT = 1337

# Replace with IoT Server's IP address (NUS)
LHOST = config.address

SIG_BYTES = 64

'''
Returns the data portion of the unencrypted payload.
'''
def getData(payload):
    data = payload[SIG_BYTES:]
    return data

'''
Verifies the signature of the data.
Returns whether the signature is valid. (Ensure no changes in data and verified signature)
'''
def verifySignature(payload, directory, filename):
    f = open(f'{directory}{filename}','rb')
    donglePublicKey = ECC.import_key(f.read())
    f.close()
    signature = payload[:SIG_BYTES]
    data = payload[SIG_BYTES:]
    verifier = eddsa.new(donglePublicKey, mode='rfc8032')
    try:
        verifier.verify(data, signature)
        return True
    except ValueError:
        return False
'''
Performs AES GCM decryption using the symmetric key.
Returns the decrypted payload containing unencrypted data and signature.
'''
def decrypt_AES_GCM(encryptedData, nonce, authTag, symmetricKey):
    aesCipher = AES.new(symmetricKey, AES.MODE_GCM, nonce)
    actualPayload = aesCipher.decrypt_and_verify(encryptedData, authTag)
    return actualPayload

'''
Decrypts the second layer of encryption
using the symmetric key obtained from first decryption.
Returns the mac address of the dongle and the decrypted payload (data + signature).
'''
def decryptWithSymmetricKey(layerTwoPayload):
    split = layerTwoPayload.split(b"<TRACK2GATHER>")
    encryptedData = split[0]
    symmetricKey = split[1]
    nonce = split[2]
    authTag = split[3]
    macAddress = split[4]
    location = split[5]
    currTime = split[6]
    return macAddress, decrypt_AES_GCM(encryptedData, nonce, authTag, symmetricKey), location, currTime

'''
Decrypts the first outer layer of encryption
using Server's private key.
Returns the second layer payload.
'''
def decryptWithServerPrivateKey(encryptedPayload):
    privKeyFile = "serverPrivKey.pem"
    f = open(f'{secretDirectory}{privKeyFile}','rb')
    key = RSA.import_key(f.read())
    f.close()
    cipher = PKCS1_OAEP.new(key)
    layerTwoPayload = cipher.decrypt(encryptedPayload)
    if verifySignature(layerTwoPayload, serverGenDirectory, "recvPublicKey.pem"):
        return getData(layerTwoPayload)
    raise Exception

'''
Sends the record ID, token ID (MAC address) and location. (And also time and RSSI soon)
'''
def sendToDB2(macAddress, location, current_time, payload):
    # Establishes connection to DB 2.
    dbConn = psycopg2.connect(
        database="db2",
        user="iot",
        host="ifs4205-gp02-3-i",
        port="5432",
        password=config.psql_password
        )
    dbConn.autocommit = True
    cursor = dbConn.cursor()
    query = "CALL add_tracingRecord(%s::macaddr, %s, %s, %s);"
    RSSI = getData(payload)
    parameters = (macAddress.decode(), current_time.decode(), location.decode(), RSSI.decode())
    cursor.execute(query, parameters)
    dbConn.close()

'''
Log a connection that has been established to IoT Server.
'''
def logEstablishedConnection(address):
    logger.info("Connection to IoT Server has been established.", extra={
        'Host': address
    })

'''
Log a forcibly closed connection by client.
'''
def logForciblyClosedConnection(address):
    logger.error("A connection to IoT Server was forcibly closed by client.", extra={
        'Host': address
    })

'''
Log the failed decryption of the first layer of a payload.
'''
def logLayerOneDecryptionFailure(address, data):
    logger.critical('Decryption of the first layer failed.', extra = {
        'Host': address,
        "Data" : data
    })

'''
Log the failed decryption of the second layer of a payload.
'''
def logLayerTwoDecryptionFailure(address, layerTwoPayload, macAddress, location, currTime):
    logger.critical('Decryption of the second layer failed.', extra = {
        'Host': address,
        "Data" : layerTwoPayload,
        "MAC-Address" : macAddress,
        "Location" : location,
        "Stored-Time": currTime
    })

'''
Log an invalid digital signature verification.
'''
def logInvalidDigitalSignature(address, payload, macAddress, location, currTime):
    logger.critical('Invalid Signature', extra = {
        'Host': address,
        "Data" : payload,
        "MAC-Address" : macAddress,
        "Location" : location,
        "Stored-Time": currTime
    })

'''
Log a normally closed connection.
'''
def logCloseconnection(address):
    logger.info("Connection to IoT Server has ended", extra={
        'Host': address
    })

'''
Starts the IoT Server and listens for IoT Receiver
to connect and send the encrypted payload.
'''
def startIotServer():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((LHOST, LPORT))
    server.listen(5)
    logger.info('Started IoT Server Socket.')
    while 1:
        logger.info("IoT Server is waiting for a connection.")
        (conn, address) = server.accept()
        logEstablishedConnection(address[0])
        while 1:
            forceReset = False
            try:
                data = conn.recv(1024)
            except ConnectionResetError:
                logForciblyClosedConnection(address[0])
                forceReset = True
                break
            if not data:
                break
            try:
                layerTwoPayload = decryptWithServerPrivateKey(data)
            except:
                logLayerOneDecryptionFailure(address[0], data)
                break
            try:
                macAddress, payload, location, currTime = decryptWithSymmetricKey(layerTwoPayload)
            except:
                logLayerTwoDecryptionFailure(address[0], layerTwoPayload, macAddress, location, currTime)
                break
            if verifySignature(payload, donglesDirectory, macAddress.decode().replace(":", "") + ".pem"):
                data = getData(payload)
                sendToDB2(macAddress, location, currTime, payload)
                print(data)
            else:
                logInvalidDigitalSignature(address[0], payload, macAddress, location, currTime)
        conn.close()
        if not forceReset:
            logCloseconnection(address[0])

def main():
    try:
        startIotServer()
    except KeyboardInterrupt:
        logger.info("IoT Server has been stopped by keyboard interrupt.")
    except Exception as e:
        logger.info(e)

if __name__ == "__main__":
    main()
