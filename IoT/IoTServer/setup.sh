#!/bin/bash
# Before running: chmod +x pre-setup.sh
# Syntax: ./setup.sh

# Install necessary system packages.
sudo apt install git -y
sudo apt install python3-pip -y
sudo apt install ssh -y
sudo apt install curl -y

cd ~
# Manually copy the project directory to home directory (~/)
# Temporary solution, since repo is private.
# git clone https://github.com/Kair0s3/TestingDevSecOps.git
cd IFS4205-AY2223-S1-G2-Track2Gather/IoT/IoTServer/

# Create least privileged iotsvc user
sudo useradd -m iotsvc

# Make directory for iotsvc
sudo mkdir -p /home/iotsvc
sudo chown iotsvc:iotsvc /home/iotsvc
sudo chmod 755 /home/iotsvc

# Set up SFTP Server https://www.digitalocean.com/community/tutorials/how-to-enable-sftp-without-shell-access-on-ubuntu-20-04
# Using another bash script to create user, password for sftp.
sudo chmod +x Helpers/adduser.sh
sudo Helpers/adduser.sh
# Sets up necessary directories.
sudo mkdir -p /home/sftp/Dongles/
sudo mkdir -p /home/sftp/Receiver/
sudo mkdir -p /home/sftp/Server/
sudo mkdir -p /home/sftp/ServerGenKeys/
# Sets up the permissions for the sftp-related directories.
sudo chown root:root /home/sftp
sudo chmod 755 /home/sftp
sudo chown sftp:sftp /home/sftp/Dongles
sudo chown sftp:sftp /home/sftp/Receiver
sudo chown sftp:sftp /home/sftp/Server
sudo chown sftp:sftp /home/sftp/ServerGenKeys
# Sets up the SSH configuration file for SFTP.
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bk
sudo cp SFTP/sshd_config /etc/ssh/sshd_config
sudo systemctl restart sshd

# Resets the iptables to default allow all.
sudo chmod +x Helpers/resetIPtables.sh
sudo Helpers/resetIPtables.sh

# iptables rules
#######################################################################
# Allow Receivers to SFTP and connect to IoT Server.
sudo chmod +x Helpers/batchRecvIPs.sh
sudo Helpers/batchRecvIPs.sh

# Drop everything in-bound by default. COMMENT ME IF TESTING. IMPORTANT
sudo iptables -P INPUT DROP

# Track state of connection and allow those.
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow ICMP.
sudo iptables -A INPUT -p icmp -j ACCEPT

# Enabling DNS Resolutions. (For logtail and perhaps nus domain)
sudo iptables -A INPUT -p udp --sport 53 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 53 -j ACCEPT
#######################################################################

# Set up Log Tail for system.
sudo chmod +x Helpers/systemLogTail.sh
sudo bash Helpers/systemLogTail.sh

# Set python files to 755 permission.
sudo chmod 755 *.py

# Install python packages.
pip3 install -r requirements.txt

# Install logtail package to run pentestUtil.
sudo pip3 install logtail_python

# Install python packages for `iotsvc` user.
sudo -u iotsvc pip3 install -r requirements.txt

# Generate RSA Key pairs.
python3 generateRSAKeypair.py

# Copy the keypairs to the SFTP public directories.
# 1. Copy server public key to sftp's Server directory.
sudo cp Share/serverPubKey.pem /home/sftp/Server/
sudo chown sftp:sftp /home/sftp/Server/serverPubKey.pem
# 2. Copy ServerGeneratedKeys for dongle/recv to sftp's ServerGenKeys directory.
sudo cp ServerGenKeys/* /home/sftp/ServerGenKeys/
sudo chown sftp:sftp /home/sftp/ServerGenKeys/*

# Finally, start the IoT Server.
sudo -u iotsvc nohup python3 IoTServer.py &

# Run the pentest utility file.
sudo python3 pentestUtil.py &
