#!/usr/bin/env bash

./gradlew buildFatJar

docker build -t quetzal-test .