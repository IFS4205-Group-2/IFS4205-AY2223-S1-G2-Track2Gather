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
sudo iptables -A INPUT -s NUS_IP -j ACCEPT
sudo iptables -A OUTPUT -d NUS_IP -j ACCEPT
sudo iptables -P INPUT DROP
sudo iptables -P OUTPUT DROP
