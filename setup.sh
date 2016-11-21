#!/bin/bash

cd ..

if [ ! -d ./rpd ]; then
    git clone git@github.com:shamansir/rpd.git
fi

cd ./rpd
gulp -r svg -s plain -t util -o ../jb-rpd-splash
cd ../jb-rpd-splash

if [ ! -f ./kefir.min.js ]; then
    wget http://rawgit.com/rpominov/kefir/gh-pages/dist/kefir.min.js
fi
