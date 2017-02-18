#!/bin/bash

if [ ! -f ./d3-voronoi.v1.min.js ]; then
    wget https://d3js.org/d3-voronoi.v1.min.js --no-check-certificate
fi

if [ ! -f ./loaders.min.css ]; then
    wget https://raw.githubusercontent.com/ConnorAtherton/loaders.css/master/loaders.min.css --no-check-certificate
fi

if [ ! -f ./canvas-to-blob.js ]; then
    wget https://raw.githubusercontent.com/blueimp/JavaScript-Canvas-to-Blob/master/js/canvas-to-blob.js --no-check-certificate
fi
