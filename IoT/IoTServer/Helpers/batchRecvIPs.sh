#!/bin/bash

# Automates the iptables for whitelisted IPs in `whitelistIPs.txt`
cat whitelistIPs.txt | while read ip
do
  if [ ! -z "$ip" ]; then
    iptables -A INPUT -p tcp -j ACCEPT -s $ip --dport 22
    iptables -A INPUT -p tcp -j ACCEPT -s $ip --dport 1337
  fi
done
