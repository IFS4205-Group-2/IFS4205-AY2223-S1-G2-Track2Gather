#!/bin/bash

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
