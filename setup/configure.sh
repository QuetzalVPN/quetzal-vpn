#!/usr/bin/env bash
# Executed on openvpn container start to configure the server

set -ex

EASY_RSA_LOC="/etc/openvpn/easyrsa"
SERVER_CERT="${EASY_RSA_LOC}/pki/issued/server.crt"


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

mkdir -p /dev/net
if [ ! -c /dev/net/tun ]; then
    mknod /dev/net/tun c 10 200
fi

# Load the default server configuration file if it doesn't exist
[ ! -f "/etc/openvpn/server.conf" ] && cp "/etc/openvpn-setup/server.conf" "/etc/openvpn/server.conf"

# Copy the scripts to the openvpn directory, so they can be executed through the docker volume
cp -f /etc/openvpn-setup/*.sh /etc/openvpn/

# Create the client-common.conf file
[ ! -f "/etc/openvpn/client-common.conf" ] && cp "/etc/openvpn-setup/client-common.conf" "/etc/openvpn/client-common.conf"

[ -d $EASY_RSA_LOC/pki ] && chmod 755 $EASY_RSA_LOC/pki
[ -f $EASY_RSA_LOC/pki/crl.pem ] && chmod 644 $EASY_RSA_LOC/pki/crl.pem

mkdir -p /etc/openvpn/ccd


openvpn --config /etc/openvpn/server.conf --client-config-dir /etc/openvpn/ccd --management 0.0.0.0 9999