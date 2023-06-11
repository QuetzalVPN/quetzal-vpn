#!/usr/bin/env bash
client=$1

# Create the client config directory
mkdir -p /etc/openvpn/ccd/"$client"

# Make the client.ovpn file
{
cat "$OPENVPN_CONFIG_PATH"/client-common.conf
echo -e "\n"
echo "<ca>"
cat "$EASYRSA_PKI"/ca.crt
echo "</ca>"
echo "<cert>"
sed -ne '/BEGIN CERTIFICATE/,$ p' "$EASYRSA_PKI"/issued/"$client".crt
echo "</cert>"
echo "<key>"
cat "$EASYRSA_PKI"/private/"$client".key
echo "</key>"
echo "<tls-auth>"
sed -ne '/BEGIN OpenVPN Static key/,$ p' "$EASYRSA_PKI"/ta.key
echo "</tls-auth>"
} > "$OPENVPN_CONFIG_PATH"/ccd/"$client"/"$client".ovpn
