#!/usr/bin/env bash

./gradlew buildFatJar

if [ "$1" = "dev" ] ; then
  docker compose -f docker-compose.dev.yml build quetzal
  docker compose -f docker-compose.dev.yml up quetzal -d
fi