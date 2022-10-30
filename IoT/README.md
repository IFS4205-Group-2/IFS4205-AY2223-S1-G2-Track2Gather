# IoT Component Documentation

## IoT Components

1. IoT Server
2. IoT Dongle & Receiver

## 1. IoT Server

### Getting Started

```
cd ~
git clone <Track2Gather-repo-url>
cd IFS4205-AY2223-S1-G2-Track2Gather/IoT/IoTServer/
```

> From here on, all instructions for IoT Server are relative to current working directory i.e. `IoTServer/`

### Manual Configurations

List of manual configurations needed, before running the setting up the IoT server.
1. Configure SFTP User Credentials
2. Configure Logtail Source Token
3. Configure PostgreSQL IOT user credential
4. Configure iptables IP whitelist
5. Configure IoT Server socket address

### SFTP User Credentials

In the `Helpers/adduser.sh` file, replace `REDACTED` with the intended `sftp` user password.

```
#!/bin/bash

# Replace with actual password.
sftp_password="REDACTED"
sftp_user="sftp"

useradd -m -s /bin/bash "$sftp_user"
echo "$sftp_user:$sftp_password" | sudo chpasswd
```

Next, configure the `config.py`, to replace the `REDACTED` with the intended `sftp` user password mentioned above.

```
# SFTP
sftp_user="sftp"
sftp_password="REDACTED"
```

### Logtail Source Token

For the logtail token, you will need to obtain from the Logtail's dashboard. Then in the `config.py` file, replace the `REDACTED` with the obtained token value.

```
# Logtail
source_token="REDACTED"
```

### PostgreSQL IoT user credential

In the `config.py`, replace the `REDACTED` value with the actual password for IoT database user.

```
# PSQL
psql_password="REDACTED"
```

### iptables IP whitelist

> Each line should only contain one address.

To allow only the IoT receiver's IP to communicate with the IoT Server, simply replace or append the IoT receiver's IP address to `whitelistIPs.txt`.

```
192.168.232.1
```

### IoT Server socket address

In the `config.py`, modify the `ip` to the IoT server's IP address.

```
# Replace with Server IP.
ip="127.0.0.1"
```

### Setting up

> IMPORTANT :warning: - If you intend to run this script on the NUS server, please make sure you keep two terminals open. So that the iptables configuration will not lock you out. The iptables has only been tested on non-NUS domain set up and yet to be tested on NUS domain. So, omit the iptables if needed.

> Assuming you have done `git clone` or copied the repository to `~/` where `~` refers to your home directory.

Once the manual [configurations](#manual-configurations) are done.
We can start running the `setup.sh` to configure the rest of the necessary configurations and installations for IoT Server. This can be done by running the following commands. Do also note, you will be prompted with the user's password.
```
chmod +x setup.sh
./setup.sh
```

After running the script, the terminal should appear similar to output below and "hangs" there. This is normal as the IoT Server has started immediately after the set up is done.
```
...
Some very long outputs from installations
...
Generating Directories...
/home/<user>/IFS4205-AY2223-S1-Team02-Track2Gather/src/Track2Gather-WebApp/IoT/IoTServer/Share/ has been created.
/home/<user>/IFS4205-AY2223-S1-Team02-Track2Gather/src/Track2Gather-WebApp/IoT/IoTServer/Secret/ has been created.
/home/<user>/IFS4205-AY2223-S1-Team02-Track2Gather/src/Track2Gather-WebApp/IoT/IoTServer/ServerGenKeys/ has been created.
Finished the required directories.
Finished setting up IoT Server's RSA key pair and ED25519 key pairs.
Goodbye.
...................................................................
```

### iptables configuration

> The actual iptables configuration is slightly modified from the sample in `setup.sh` to allow for batch whitelisting of IPs using `Helper/batchRecvIPs.sh`.

The configuration for the iptables are included in the `iptables-rules.txt` as a sample and shown below.
```
# Drop everything in-bound by default.
sudo iptables -P INPUT DROP

# Track state of connection and allow those.
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow ICMP.
sudo iptables -A INPUT -p icmp -j ACCEPT

# Enabling DNS Resolutions. (For logtail and perhaps nus domain)
sudo iptables -A INPUT -p udp --sport 53 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 53 -j ACCEPT

# Allow Receivers to SFTP and connect to IoT Server.
sudo iptables -A INPUT -p tcp -j ACCEPT -s 192.168.232.1 --dport 22
sudo iptables -A INPUT -p tcp -j ACCEPT -s 192.168.232.1 --dport 1337
```

### Sanity Check

To do a sanity check, you should be able to connect to the port and check the logs outputted on Logtail dashboard.

```
nc <IP> 1337

# After connecting (you will see no responses or anything), just type and send in anything e.g.
I am a test for sanity purposes.
```

## 2. IoT Dongle and Receivers


## Setting up IoT Dongles and Receivers

> Note that you MUST whitelist your IP (over SoC vpn or in NUS network) to test the functionalities of IoT Receiver.
> This can be done by running `nc ifs4205-gp02-5-i 4205` and providing your VPN IP.
> The port 4205 is only accessible with SoC vpn, or NUS network.
> For more information, refer to the Final Report, section "6.9. Utility Service for PenTesting/Functional Testing".

We have provided two ways for you to test the Dongles and Receivers. For both steps, make sure you are connected to the NUS VPN and that it is whitelisted as above.

1. Via setting up your own Receiver using the public repo
2. Via the Virtual Machine provided 

### Setting up your own Receiver using the public repo

In this version, you will only need an account with root privileges. However, you will need the following conditions met as well.

Each Receiver is assumed to be Bluetooth enabled, with `Python 3.8.10` installed, and has the repository cloned in the directory (`~/` or your home directory).
In this `IoTRecv` directory, the fields of the file `config.py` are redacted. Instead, you should replace this file with a `config.py` that we have provided which contain registered SFTP credentials.
For these SFTP credentials, each Virtual Machine is assumed to have the IoT Server's ECDSA key fingerprint added to the list of known hosts.

On top of that, there should a designated Receiver (*Setup Recv*). *Setup Recv* acts as a normal Receiver but it will also contain the software needed to setup the IoT Dongles.
Thus, *Setup Recv* is assumed to have an Arduino IDE installed that is configured to run RFDuino boards, and that it has these libraries installed: (Crypto, micro-ecc).

The files you will be using to set up will be `config.py`, `setup.sh`, `sync.py`, `IoTRecv.py` and `bootstrap.py`.
These are the steps to set up the Receiver:

In your home directory, change your directory by running `cd IFS4205-AY2223-S1-G2-Track2Gather/main/IoT/IoTRecv`.

Next, for normal Receivers, you can run the following commands:
```
chmod +x setup.sh
./setup.sh
```

For *Setup Recv*, you should run the following commands instead:
```
chmod +x setup.sh
./setup.sh all
```

`setup.sh` performs the following operations:
> 1. Installs all tools that does not require manual configuration (python3-pip)
> 2. Installs all Python Libraries and Packages as indicated in `requirements.txt`
> 3. Copies `../GMS/gmsservice.py` to the directory (`~/.local/lib/python3.8/site-packages/adafruit_ble/services/`)
> 4. Hardens the security by restricting the iptables
> 5. Initiates the bootstrap process by running `python3 bootstrap.py`

For *Setup Recv*, by running `./setup.sh all`, it will additionally perform the following operations:
> 6. Displays the default keys to be uploaded to the IoT Dongle by running `python3 bootstrap.py --all` instead
> 7. Syncs up any generated keys with the IoT Server by running `python3 sync.py` after you have completed uploading the sketches to the IoT Dongles

As the IoT Dongle have already been configured, there is no need to upload the sketch again.

> 📔 <span style="color:#3333ff">**NOTE:**</span>
>
> 1. Depending on the connectivity of the Bluetooth on the IoT Dongles and *Setup Recv*, `sync.py` might need to be run a few times to ensure that all keys are synced.
> 2. The battery of the Dongle might run out. If that is the case, `sync.py` has to be run again as a new IoT Dongle keypair will be generated once the IoT Dongle charges.

Once the setup is done for every Receiver, you can start the Receiver by manually running `python3 IoTRecv.py &`.

### Setting up with the provided VM

By using the VM, the setup of the Receiver has already been configured. Simply login to `Health Authorities` with the credentials provided to continue with the testing.

> 📔 <span style="color:#3333ff">**NOTE:**</span>
>
> The VM is tested on VMWare Workstation 16 Player and Pro. If possible, do continue to use the same setup.
> The `Health Authorities` account is operated with least privileges and is unable to run any `sudo` commands.

To start the Receiver, ensure that the Bluetooth in the VM is enabled. Next, `cd IFS4205-AY2223-S1-G2-Track2Gather/main/IoT/IoTRecv` and run `python3 sync.py` to ensure that the keys are synced before running `python3 IoTRecv.py &`.

## Sample Output when setting up the IoT Dongles and Receivers

Running `python3 bootstrap.py --all` can produce the following output:
```
Retrieving Keys from Server...
Retrieved serverPubKey.pem
Retrieved recvPrivateKey.pem
Retrieved recvPublicKey.pem
Retrieved defaultPrivateKey.pem
Retrieved defaultPublicKey.pem
...................................................................
Please copy this private key into the Arduino code, variable REDACTED:
{REDACTED}
...................................................................
Please copy this public key into the Arduino code, variable REDACTED:
{REDACTED}
...................................................................
Please copy this public key into the Arduino code, variable REDACTED:
{REDACTED}
...................................................................
```

Running `python3 sync.py` can produce the following output:
```
Generating Directories...
/home/healthauth/IFS4205-AY2223-S1-Team02-Track2Gather/src/Track2Gather-WebApp/IoT/IoTRecv/DongleKeys/ already exists.
/home/healthauth/IFS4205-AY2223-S1-Team02-Track2Gather/src/Track2Gather-WebApp/IoT/IoTRecv/ServerGenKeys/ already exists.
/home/healthauth/IFS4205-AY2223-S1-Team02-Track2Gather/src/Track2Gather-WebApp/IoT/IoTRecv/../IoT Server/Receiver/ already exists.
Scanning for 30 seconds...
{MAC ADDRESS 1}
Sent to IoT Server
{MAC ADDRESS 2} was not found in the scan. If this mac address is to be synced, please try again.
Finished retrieving IoT Dongle's public key.
...................................................................
```
So, if {MAC ADDRESS 2} is intended to be synced, you should run `python3 sync.py` again.

## Troubleshooting for IoT Dongle and Receiver

1. IoT Dongle seems to have died or not responding.
Solution: Connect the Dongle to the Arduino IDE and open the serial monitor. This will restart the Dongle. Run `python3 sync.py` on the *Setup Recv* to sync with the server. Try to keep the Dongle connected to a power source at all times.

2. `python3 sync.py` cannot sense the Dongles even when in range. 
Solution: This can be due to the Bluetooth connection in the Receiver. You can try to restart the Receiver and the script should work.

3. The receiver seems to be down, i.e it does not connect to the Dongle or Server
Solution: Double-check your VPN connection, check if the Bluetooth is still functional and that the Dongles are still visible via Bluetooth. Restart the receiver if necessary.

4. Running `python3 sync.py` raises FileNotFoundError when verifying signatures. 
Solution: `sync.py` can only be run in *Setup Recv*, which has ran `python3 bootstrap.py --all`. To do so, either run that command, or `./setup.sh all`.

## Unit Testing

In the `test` directory, run the following command
```
python -m unittest discover -s . -p "IoT*Tests.py"
```

This will run the `IoTServerTests.py` and `IoTRecvTests.py` files that performs unit testing for both `IoTServer.py` and `IoTRecv.py`.
