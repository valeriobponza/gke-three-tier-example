#!/bin/bash

echo building image node_project:build

docker build -t node_project:build -f Dockerfile.build .

# create a new container from the image and copy dist folder content to distapp folder
docker create --name copyContainer node_project:build
docker cp copyContainer:/usr/src/app/dist ./distapp
docker rm -f copyContainer

echo building image node_project:prod 

docker build -t node_project:prod -f Dockerfile.prod .