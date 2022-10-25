#!/bin/bash
# Flush iptables rules.
iptables -F

# Reset policies to ACCEPT by default.
iptables --policy INPUT ACCEPT
iptables --policy FORWARD ACCEPT
iptables --policy OUTPUT ACCEPT

# Give access to everyone on port 4205 - utility port.
sudo iptables -A INPUT -p tcp --sport 4205 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 4205 -j ACCEPT
