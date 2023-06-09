#!/usr/bin/env bash
# Executed on openvpn container start to configure the server

set -ex

EASY_RSA_LOC="/etc/openvpn/easyrsa"
SERVER_CERT="${EASY_RSA_LOC}/pki/issued/server.crt"

OVPN_SERVER_NET="172.16.100.0"
OVPN_SERVER_MASK="255.255.255.0"

OVPN_SRV_NET=${OVPN_SERVER_NET:-172.16.100.0}
OVPN_SRV_MASK=${OVPN_SERVER_MASK:-255.255.255.0}


mkdir -p $EASY_RSA_LOC
cd $EASY_RSA_LOC

if [ -e "$SERVER_CERT" ]; then
  echo "Found existing certs - reusing"
else

  echo "Generating new certs"
  easyrsa init-pki
  cp -R /usr/share/easy-rsa/* $EASY_RSA_LOC/pki
  echo "ca" | easyrsa build-ca nopass
  easyrsa build-server-full server nopass
  easyrsa gen-dh
  openvpn --genkey --secret ./pki/ta.key

fi
easyrsa gen-crl

iptables -t nat -D POSTROUTING -s ${OVPN_SRV_NET}/${OVPN_SRV_MASK} ! -d ${OVPN_SRV_NET}/${OVPN_SRV_MASK} -j MASQUERADE || true
iptables -t nat -A POSTROUTING -s ${OVPN_SRV_NET}/${OVPN_SRV_MASK} ! -d ${OVPN_SRV_NET}/${OVPN_SRV_MASK} -j MASQUERADE

mkdir -p /dev/net
if [ ! -c /dev/net/tun ]; then
    mknod /dev/net/tun c 10 200
fi

# Load the default server configuration file if it doesn't exist
[ ! -f "/etc/openvpn/server.conf" ] && cp "/etc/openvpn-setup/server.conf" "/etc/openvpn/server.conf"

# Copy the scripts to the openvpn directory, so they can be executed through the docker volume
cp -f /etc/openvpn-setup/*.sh /etc/openvpn/

# Create the client-common.txt file
# TODO: Make this configurable
[ ! -f "/etc/openvpn/client-common.txt" ] && cp "/etc/openvpn-setup/client-common.txt" "/etc/openvpn/client-common.txt"

[ -d $EASY_RSA_LOC/pki ] && chmod 755 $EASY_RSA_LOC/pki
[ -f $EASY_RSA_LOC/pki/crl.pem ] && chmod 644 $EASY_RSA_LOC/pki/crl.pem

mkdir -p /etc/openvpn/ccd


openvpn --config /etc/openvpn/server.conf --client-config-dir /etc/openvpn/ccd --port 1194 --management 0.0.0.0 9999
