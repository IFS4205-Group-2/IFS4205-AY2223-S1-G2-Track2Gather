#!/bin/bash
# Flush iptables rules.
iptables -F

# Reset policies to ACCEPT by default.
iptables --policy INPUT ACCEPT
iptables --policy FORWARD ACCEPT
iptables --policy OUTPUT ACCEPT
