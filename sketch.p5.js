/**
 * Created by jetbrains on 29/06/16.
 *
 */


/* import megamu.mesh.*;
import processing.core.PApplet;
import processing.core.PGraphics;
import processing.core.PImage;
import processing.core.PShape;

import java.util.ArrayList;
import java.util.List; */

var options = {
    width: 1000,
    height: 500,
    maxPoints: 5000,
    scale: 1,
    maxSquareSize: 3,
    density: 6,
    inregularity: 0.7,
    backImgSrc: './experiment_bg.png'
}

var backImg, grad, my;

var lastPoint;

var pointData = [];

function preload() {
    loadImage(options.backImgSrc, function(img) {
        img.loadPixels();
        pointData = collectPointData(options, img.pixels, img.width, img.height);
    });
}

function setup() {
    createCanvas(options.width, options.height);
    noLoop();
}

function draw() {
    var step = 12 * options.scale;

    background(0x161616);

    fill(0xFFFFFF)

    if (pointData && pointData.length) {
        for (var i = 0; i < pointData.length; i++) {
            rect(pointData[i][0], pointData[i][1],
                 10 * (pointData[i][2] / 255),
                 10 * (pointData[i][2] / 255));
        }
    }
}

function collectPointData(options, pixels, imgWidth, imgHeight) {
    var step = options.step;
    var maxPoints = options.maxPoints;
    var inregularity = options.inregularity;

    var width = options.width;
    var height = options.height;

    var idx, brightness, r, g, b, a;

    var lastPoint;

    var pointData = [];

    var xpos, ypos;

    //var d = pixelDensity();

    for (var x = 0; x < imgWidth; x += step) {

        if (pointData.length >= maxPoints) break;

        for (var y = 0; y < imgHeight; y += step) {

            if (pointData.length >= maxPoints) break;

            idx = (x + y * width) * 4;

            r = pixels[idx];
            g = pixels[idx+1];
            b = pixels[idx+2];
            a = pixels[idx+3];

            brightness = brightness(color(r, g, b, a));

            if ((brightness > 3) && (random(0, brightness) < 70)) {

                xpos = ((x / imgWidth) * width) + (random(-step / 2, step / 2) * inregularity);
                ypos = ((y / imgHeight) * height) + (random(-step / 2, step / 2) * inregularity);

                collectPointData.push([ xpos, ypos, brightness ]);
            }

        }

    }

    return pointData;
}
