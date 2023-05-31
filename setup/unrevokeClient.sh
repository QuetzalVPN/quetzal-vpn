#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: $0 <client> <serial>"
    exit 1
fi

CLIENT=$1
SERIAL=$2


mv "$EASYRSA_PKI"/revoked/certs_by_serial/"$SERIAL".crt "$EASYRSA_PKI"/certs_by_serial/"$SERIAL".crt
cp "$EASYRSA_PKI"/certs_by_serial/"$SERIAL".crt "$EASYRSA_PKI"/issued/"$CLIENT".crt

mv "$EASYRSA_PKI"/revoked/private_by_serial/"$SERIAL".key "$EASYRSA_PKI"/private/"$CLIENT".key

mv "$EASYRSA_PKI"/revoked/reqs_by_serial/"$SERIAL".req "$EASYRSA_PKI"/reqs/"$CLIENT".req

