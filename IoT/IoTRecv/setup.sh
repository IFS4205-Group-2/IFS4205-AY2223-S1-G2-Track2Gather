#!/bin/bash

sudo apt install git -y
sudo apt install python3-pip -y
sudo apt install curl -y
sudo apt-get install iptables-persistent -y

pip3 install -r requirements.txt

sudo cp ../GMS/gmsservice.py ~/.local/lib/python3.8/site-packages/adafruit_ble/services/

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


sudo sh -c "iptables-save > /etc/iptables/rules.v4"

if [ "$1" = "all" ] 
then
	python3 bootstrap.py --all
	echo Setup completed. 
	read -p "Press enter to continue after the sketches are uploaded to the IoT Dongle via the Arduino IDE..." 
	python3 sync.py
	echo If all keys are synced, you can start the receiver by running \"python3 IoTRecv.py \&\". 
	echo Otherwise, rerun \"python3 sync.py\" manually, making sure that all keys are close to this receiver, before starting the receiver.
else
	python3 bootstrap.py
	echo Setup completed. You may start the receiver by running \"python3 IoTRecv.py \&\".
fi


