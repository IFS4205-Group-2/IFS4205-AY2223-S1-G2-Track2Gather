#!/bin/bash

sudo apt install git -y
sudo apt install python3-pip -y
sudo apt install curl -y

cd ~

# Should be cloned onto the receiver already
# git clone https://REDACTED@github.com/IFS4205-Group-2/IFS4205-AY2223-S1-Team02-Track2Gather.git

cd Documents/IoTRecv/
# cd IFS4205-AY2223-S1-Team02-Track2Gather/src/Track2Gather-WebApp/IoT/IoTRecv/

sudo cp ../GMS/gmsservice.py ~/.local/lib/python3.8/site-packages/adafruit_ble/services/

pip3 install -r requirements.txt

# Replace with IoT Server IP
sudo iptables -F
sudo iptables -A INPUT -s NUS_IP -j ACCEPT
sudo iptables -A OUTPUT -d NUS_IP -j ACCEPT
sudo iptables -P INPUT DROP
sudo iptables -P OUTPUT DROP

if [ "$1" = "all" ] 
then
	python3 bootstrap.py --all
	echo Setup completed. 
	read -p "Press enter to continue after the sketches are uploaded to the IoT Dongle via the Arduino IDE..." 
	python3 sync.py
	echo If all keys are synced, you can continue to start the receiver by running \"python3 IoTRecv.py\". 
	echo Otherwise, rerun \"python3 sync.py\" manually, making sure that all keys are close to this receiver, before starting the receiver.
else
	python3 bootstrap.py
	echo Setup completed. You may start the receiver by running \"python3 IoTRecv.py\".
fi


