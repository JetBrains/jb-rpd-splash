#!/bin/bash

# cd ..

# if [ ! -d ./rpd ]; then
#    git clone git@github.com:shamansir/rpd.git
# fi

if [ -d ../rpd ]; then
    cd ../rpd
    gulp -r svg -s ableton-out -t util -o ../jb-rpd-splash
    cd ../jb-rpd-splash
fi

# if [ -d ../rpd ]; then
#     cd ../rpd
#     gulp -r svg -s ableton-out -t util -o ../jb-rpd-splash --compilation whitespace --pretty
#     cd ../jb-rpd-splash
# fi

if [ ! -f ./kefir.min.js ]; then
    wget https://rawgit.com/rpominov/kefir/gh-pages/dist/kefir.min.js --no-check-certificate
fi

if [ ! -f ./p5.min.js ]; then
    wget https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.19/p5.min.js --no-check-certificate
fi

if [ ! -f ./p5.dom.js ]; then
    wget https://raw.githubusercontent.com/lmccart/p5.js/master/lib/addons/p5.dom.js --no-check-certificate
fi

if [ ! -f ./d3.v4.min.js ]; then
    wget https://d3js.org/d3.v4.min.js --no-check-certificate
fi

if [ ! -f ./d3-voronoi.v1.min.js ]; then
    wget https://d3js.org/d3-voronoi.v1.min.js --no-check-certificate
fi

if [ ! -f ./loaders.min.css ]; then
    wget https://raw.githubusercontent.com/ConnorAtherton/loaders.css/master/loaders.min.css --no-check-certificate
fi

if [ ! -f ./canvas-to-blob.js ]; then
    wget https://raw.githubusercontent.com/blueimp/JavaScript-Canvas-to-Blob/master/js/canvas-to-blob.js --no-check-certificate
fi
