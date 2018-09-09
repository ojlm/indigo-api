#!/usr/bin/env bash
yarn run build
cp -r ../dist .
docker build --file ./Dockerfile -t asurapro/indigo:latest .
rm -rf dist
docker push asurapro/indigo
