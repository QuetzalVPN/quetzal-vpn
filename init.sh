#!/usr/bin/env sh
docker-compose run --rm openvpn ovpn_genconfig -u udp://"$1"
docker-compose run --rm openvpn ovpn_initpki