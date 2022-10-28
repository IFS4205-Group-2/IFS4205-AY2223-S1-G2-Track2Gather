#!/bin/bash

sudo apt install git -y
sudo apt install python3-pip -y
sudo apt install curl -y

sudo cp ../GMS/gmsservice.py /home/healthauth/.local/lib/python3.8/site-packages/adafruit_ble/services/ && sudo chown healthauth:healthauth /home/healthauth/.local/lib/python3.8/site-packages/adafruit_ble/services/gmsservice.py

cd /home/healthauth
sudo git clone https://github.com/IFS4205-Group-2/IFS4205-AY2223-S1-G2-Track2Gather
sudo chown healthauth:healthauth /home/healthauth/IFS4205-AY2223-S1-G2-Track2Gather/ -R

# Replace with IoT Server IP

sudo iptables -F

# Reset policies to ACCEPT by default.
sudo iptables --policy INPUT ACCEPT
sudo iptables --policy FORWARD ACCEPT
sudo iptables --policy OUTPUT ACCEPT

# Drop all outgoing
sudo iptables -P OUTPUT DROP

# For logtail
sudo iptables -A OUTPUT -p udp --sport 53 -j ACCEPT
sudo iptables -A OUTPUT -p udp --dport 53 -j ACCEPT

sudo iptables -A OUTPUT -j ACCEPT -p tcp --dport 80
sudo iptables -A OUTPUT -j ACCEPT -p tcp --dport 443
sudo iptables -A OUTPUT -p tcp -j ACCEPT -d NUS_IP --dport 22
sudo iptables -A OUTPUT -p tcp -j ACCEPT -d NUS_IP --dport 1337