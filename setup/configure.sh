#!usr/bin/env bash
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
echo "client
tls-client
key-direction 1
dev tun
proto tcp
remote 127.0.0.1 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
cipher AES-256-CBC
ignore-unknown-option block-outside-dns
verb 3" > /etc/openvpn/client-common.txt

#if [ ${OVPN_PASSWD_AUTH} = "true" ]; then
#  mkdir -p /etc/openvpn/scripts/
#  cp -f /etc/openvpn/setup/auth.sh /etc/openvpn/scripts/auth.sh
#  chmod +x /etc/openvpn/scripts/auth.sh
#  echo "auth-user-pass-verify /etc/openvpn/scripts/auth.sh via-file" | tee -a /etc/openvpn/openvpn.conf
#  echo "script-security 2" | tee -a /etc/openvpn/openvpn.conf
#  echo "verify-client-cert require" | tee -a /etc/openvpn/openvpn.conf
#  openvpn-user db-init --db.path=$EASY_RSA_LOC/pki/users.db
#fi


[ -d $EASY_RSA_LOC/pki ] && chmod 755 $EASY_RSA_LOC/pki
[ -f $EASY_RSA_LOC/pki/crl.pem ] && chmod 644 $EASY_RSA_LOC/pki/crl.pem

mkdir -p /etc/openvpn/ccd


openvpn --config /etc/openvpn/server.conf --client-config-dir /etc/openvpn/ccd --port 1194 --management 0.0.0.0 9999
