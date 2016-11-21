#!/bin/bash

cd ..

if [ ! -d ./rpd ]; then
    git clone git@github.com:shamansir/rpd.git
fi

cd ./rpd
gulp -r svg -s compact-v -t util -o ../jb-rpd-splash
cd ../jb-rpd-splash

if [ ! -f ./kefir.min.js ]; then
    wget http://rawgit.com/rpominov/kefir/gh-pages/dist/kefir.min.js
fi

if [ ! -f ./p5.min.js ]; then
    wget https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.19/p5.min.js
fi

if [ ! -f ./p5.dom.js ]; then
    wget https://raw.githubusercontent.com/lmccart/p5.js/master/lib/addons/p5.dom.js
fi

if [ ! -f ./d3-voronoi.v1.min.js ]; then
    wget https://d3js.org/d3-voronoi.v1.min.js
fi
