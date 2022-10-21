#!/bin/bash
# Since token is already configured in `config.py`.
source config.py

# Remove previously configured config file.
sudo rm /etc/vector/vector.toml

# Installation and configuration of LogTail for System.
curl -1sLf \
  'https://repositories.timber.io/public/vector/cfg/setup/bash.deb.sh' \
  | sudo -E bash

cp LogTail/vector /etc/apt/preferences.d/vector && apt-get install vector=0.22.3-1

wget -O ->> /etc/vector/vector.toml \
    https://logtail.com/vector-toml/ubuntu/$source_token

# Restart the service.
systemctl restart vector
