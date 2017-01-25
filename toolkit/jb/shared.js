function initP5(w, h) {
    return function(p) {
        p.setup = function() {
            var c = p.createCanvas(w, h);
            c.addClass('p5-canvas');
            p.noLoop();
        };
        p.draw = function() {
            p.clear();
            p.background(0, 0);
            //drawForms(p, getForms() || []);
        };
    }
}

/* function maybeCachedImage(p, f) {
    return p.createImg(f.data);
} */

var PRODUCTS = [

    { label: 'JB',  id: 'jetbrains',     palette: [ '#9151e1', '#fde74a', '#ec4476'] },  // jetbrains-1
    { label: ' ',   id: 'empty0',        palette: [ ] },  // separator
    { label: 'IJ',  id: 'intellij-idea', palette: [ '#087cfa', '#fe315d', '#f97a12' ] },  // idea // IJ_
    { label: 'PS',  id: 'phpstorm',      palette: [ '#b24eee', '#7660f4', '#fc378c' ] },  // phpstorm // PS_
    { label: 'PC',  id: 'pycharm',       palette: [ '#21d789', '#fcf84a', '#07c3f2' ] },  // pycharm // PC_
    { label: 'RM',  id: 'rubymine',      palette: [ '#fc2555', '#fd8638', '#8f41cd' ] },  // rubymine // RM_
    { label: 'WS',  id: 'webstorm',      palette: [ '#22cdd6', '#2888d4', '#feee56' ] },  // webstorm // WS_
    { label: 'CL',  id: 'clion',         palette: [ '#32d791', '#1a9edd', '#ea3a8c' ] },  // clion // CL_
    { label: 'DG',  id: 'datagrip',      palette: [ '#32d791', '#9779f5', '#fd5fe4' ] },  // // DG_
    { label: 'AC',  id: 'appcode',       palette: [ '#2b7fe3', '#25daee', '#30de95' ] },  // appcode // AC_
    { label: ' ',   id: 'empty1',        palette: [ ] },  // separator
    { label: 'R#',  id: 'resharper',     palette: [ '#c21456', '#e14ce3', '#fdbc2c' ] },  // resharper // R#_
    { label: 'R++', id: 'resharper-cpp', palette: [ '#fdbc2c', '#e14ce3', '#c21456' ] },  // // R++_
    { label: 'DC',  id: 'dotcover',      palette: [ '#fd7522', '#786bfb', '#e14ce3' ] },  // dotcover // DC_
    { label: 'DM',  id: 'dotmemory',     palette: [ '#fdbc2c', '#786bfb', '#e14ce3' ] },  // // DM_
    { label: 'DP',  id: 'dotpeek',       palette: [ '#23cbfc', '#786bfb', '#e14ce3' ] },  // // DP_
    { label: 'DT',  id: 'dottrace',      palette: [ '#fc1681', '#786bfb', '#e14ce3' ] },  // dottrace // DT_
    { label: ' ',   id: 'empty2',        palette: [ ] },  // separator
    { label: 'TC',  id: 'teamcity',      palette: [ '#22b1ef', '#9062f7', '#46e869' ] },  // teamcity // TC_
    { label: 'YT',  id: 'youtrack',      palette: [ '#22b1ef', '#9062f7', '#fc378c' ] },  // youtrack // YT_
    { label: 'UP',  id: 'upsource',      palette: [ '#22b1ef', '#9062f7', '#fd8224' ] },  // upsource // UP_
    { label: 'HB',  id: 'hub',           palette: [ '#1fb9ee', '#965ff7', '#feec56' ] },  // hub // HB_
    { label: ' ',   id: 'empty3',        palette: [ ] },  // separator
    { label: 'KT',  id: 'kotlin',        palette: [ '#1b84f2', '#24dea7', '#ed4baa' ] },   // kotlin // KT_
    { label: 'MPS', id: 'mps',           palette: [ '#31d68b', '#3188cd', '#f1e969' ] }  // mps // MPS_

];

function numberToHex(num) { return (num > 15) ? num.toString(16) : '0' + num.toString(16); }

function toHexColor(color) {
    return '#' + numberToHex(color.r || 0)
               + numberToHex(color.g || 0)
               + numberToHex(color.b || 0);
}

function hexToColor (p, hex, opacity) {
      // TODO: unhex!!
      return p.color(p.red(p.color(hex)),  p.green(p.color(hex)),  p.blue(p.color(hex)), opacity);

}

function _rgb(r, g, b, a) {
    return { r: r, g: g, b: b, a: a };
}

function howMuch(single, plural) {
    return function(list) {
        if (!list) return 'Nothing';
        if (list.length == 0) return 'No ' + plural;
        if (list.length == 1) return 'One ' + single;
        if (list.length == 2) return 'Two ' + plural;
        return list.length + ' ' + plural;
    };
}

function stopPropagation(event) {
    event.stopPropagation();
    return event;
}

// ============= Sketch-specific =============

var imagesToLoad = PRODUCTS.map(function(product) {
    return {
        product: product,
        id: product.id + '/logo',
        path: 'logos/' + product.id + '-text-square.svg'
    };
});

imagesToLoad = imagesToLoad.concat(PRODUCTS.map(function(product) {
    return {
        product: product,
        id: product.id + '/bg',
        path: 'bg/' + product.id + '-bg.png'
    };
}));

var readyImgCount = 0;
var cachedImages = {};
var imagesErrors = {};
function loadSketchImages(p, onComplete) {
    showLoaderAt(0);
    imagesToLoad.forEach(function(imgSpec, index) {
        if (cachedImages[imgSpec.id] || imagesErrors[imgSpec.id]) return;
        var img = new Image();
        //console.log('start loading image', imgSpec.id);
        img.onload = function() {
            //console.log('received', imgSpec.path);
            cachedImages[imgSpec.id] = img;
            readyImgCount++;
            //console.log('images ready:', readyImgCount + '/' + imagesToLoad.length);
            showLoaderAt(readyImgCount / imagesToLoad.length, 'Loading Images');
            if (readyImgCount == imagesToLoad.length) {
                if (onComplete) onComplete();
                hideLoader();
                //console.log('finished loading images');
            }
        };
        img.onerror = function() {
            imagesErrors[imgSpec.id] = true;
            //console.log('image at ' + imgSpec.path + ' failed to load');
            readyImgCount++;
            //console.log('images ready:', readyImgCount + '/' + imagesToLoad.length);
            showLoaderAt(readyImgCount / imagesToLoad.length, 'Loading Images');
            if (readyImgCount == imagesToLoad.length) {
                if (onComplete) onComplete();
                hideLoader();
                //console.log('finished loading images');
            }
        };
        img.src = imgSpec.path;
    });
}

// jb/noise
var EMPTY_PIXELS = {
  width: 0,
  height: 0,
  values: [],
  step: 10,
  seed: -1,
  density: -1,
  time: -1
};

function makePixelExtractingSketch(className, drawContent, adaptPixels) {
    var refresher;

    function refreshSketch(inlets) {
        return refresher ? refresher(inlets) : EMPTY_PIXELS;
    }

    var sketchFunc = function(p) {
        var width = window.innerWidth;
        var height = window.innerHeight;

        var setupCalled = false;

        var ctx;
        var cvs;

        p.setup = function() {
            cvs = p.createCanvas(width, height).parent('rpd-jb-preview-target');
            //cvs.position(-5000, -5000);
            cvs.canvas.className = className || 'hidden-canvas';
            cvs.canvas.style.display = 'none';
         //  console.log(cvs);
            //cvs.style.display = 'none';

            ctx = cvs.drawingContext;
            p.background(p.color(0, 0, 0, 0));
            p.noLoop();
            setupCalled = true;
        };

        var lastConfig;
        var lastPixels;
        refresher = function(inlets) {
            if (!setupCalled) return;
            lastConfig = inlets;
            p.redraw();
            return adaptPixels
                ? adaptPixels(lastPixels, lastConfig, p, cvs.canvas, width, height)
                : lastPixels;
        };

        p.draw = function() {
            if (!lastConfig) return;

            p.clear();
            //lastValues = [];

            drawContent(p, lastConfig, ctx, width, height);

            p.loadPixels();
            lastPixels = p.pixels;
        };
    };

    /*var backgroundP5 =*/ new p5(sketchFunc);

    return refreshSketch;
}

// jb/noise
function initNoiseSketch() {
    var lastSeed, lastStep;
    return makePixelExtractingSketch('noise-canvas',
        function(p, inlets, ctx, width, height) {
            p.noStroke();
            p.noiseDetail(inlets.octave, inlets.falloff);
            lastSeed = p.random(1000);
            lastStep = inlets.grain;
            p.noiseSeed(lastSeed);
            var x, y, c;

            //for (var x = 0; x <= width/2+10; x+=10) {
            for (x = 0; x < width; x+=lastStep) {
                //var column = [];
                for (y = 0; y < height; y+=lastStep) {
                    c = 255 * p.noise(0.005 * x, 0.005 * y);
                    //c = (x / width) * 255;
                    p.fill(c);
                    p.rect(x, y, lastStep, lastStep);
                    //p.rect(width - x, y, 10, 10);
                    //column.push(c);
                }
                //lastValues.push(column);
            }
        },
        function(values, config, p, canvas, width, height) {
            return {
                width: width,
                height: height,
                values: values,
                canvas: canvas,
                time: new Date(),
                step: lastStep,
                density: p.pixelDensity(),
                seed: lastSeed
            };
        });
}

// jb/background
function initBackgroundSketch() {
    return makePixelExtractingSketch(
        'background-canvas',
        drawBackground,
        function(values, config, p, canvas, width, height) {
            return {
                width: width,
                height: height,
                values: values,
                canvas: canvas,
                time: new Date(),
                step: -1,
                density: p.pixelDensity(),
                seed: -1
            };
        });
}

function initHRorschachSketch() {
    var lastInlets;

    return makePixelExtractingSketch(
        'rorschach-canvas',
        function(p, inlets, ctx, width, height) {
            lastInlets = inlets;

            p.loadPixels();

            var pixels = inlets.pixels;
            var d = pixels.density;
            var width =  pixels.width;
            var height = pixels.height;
            var source = pixels.values;
            var target = p.pixels;

            var trgIdx, srcIdx;
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    for (var i = 0; i < d; i++) {
                        for (var j = 0; j < d; j++) {
                            trgIdx = 4 * ((y * d + j) * width * d + (x * d + i));
                            srcIdx = (x < width / 2) ? trgIdx : 4 * ((y * d + j) * width * d + ((width - x) * d + i));
                            target[trgIdx] = source[srcIdx];
                            target[trgIdx+1] = source[srcIdx+1];
                            target[trgIdx+2] = source[srcIdx+2];
                            target[trgIdx+3] = source[srcIdx+3];
                        }
                    }
                }
            }

            p.updatePixels();
        },
        function(values, config, p, canvas, width, height) {
            return {
                width: width,
                height: height,
                values: values,
                canvas: canvas,
                time: new Date(),
                step: lastInlets.pixels.step,
                density: p.pixelDensity(),
                seed: lastInlets.pixels.seed
            };
        });
}

function initVRorschachSketch() {
    var lastInlets;
    return makePixelExtractingSketch(
        'rorschach-canvas',
        function(p, inlets, ctx, width, height) {
            lastInlets = inlets;

            p.loadPixels();

            var pixels = inlets.pixels;
            var d = pixels.density;
            var width =  pixels.width;
            var height = pixels.height;
            var source = pixels.values;
            var target = p.pixels;

            var trgIdx, srcIdx;
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    for (var i = 0; i < d; i++) {
                        for (var j = 0; j < d; j++) {
                            trgIdx = 4 * ((y * d + j) * width * d + (x * d + i));
                            srcIdx = (y < height / 2) ? trgIdx : 4 * (((height - y) * d + j) * width * d + ((x * d + i)));
                            target[trgIdx] = source[srcIdx];
                            target[trgIdx+1] = source[srcIdx+1];
                            target[trgIdx+2] = source[srcIdx+2];
                            target[trgIdx+3] = source[srcIdx+3];
                        }
                    }
                }
            }

            p.updatePixels();
        },
        function(values, config, p, canvas, width, height) {
            return {
                width: width,
                height: height,
                values: values,
                canvas: canvas,
                time: new Date(),
                step: lastInlets.pixels.step,
                density: p.pixelDensity(),
                seed: lastInlets.pixels.seed
            };
        });
}

// jb/draw-pixels
function drawPixels(p, config, ctx, renderOptions) {
    var pixels = config.pixels;
    var blur = config.blur;
    var contrast = Math.floor(config.contrast * 255);

    var opacity = renderOptions.opacity;

    if (!pixels) return;

    p.push();

    if (opacity) ctx.globalAlpha = opacity;

    ctx.drawImage(pixels.canvas, 0, 0, pixels.width, pixels.height);

    p.loadPixels();

    var src = p.pixels; // pixels.values
    var trg = p.pixels;

    // console.log('copying', src.length, 'pixels to', pixels.length, 'pixels');
    for (var i = 0; i < src.length; i += 4) {

        trg[i] = src[i] - contrast ;
        trg[i+1] = src[i+1] - contrast ;
        trg[i+2] = src[i+2] - contrast;
        trg[i+3] = src[i+3]/*  * opacity */;

        //trg[i] = src[i];
    }
    p.updatePixels();
    if (blur) { p.filter(p.BLUR, blur); }

    p.pop();

}

// jb/collect-point-data
function collectPointData(pixels, config) {

    var srcPixels = pixels.values;

    if (!srcPixels || !srcPixels.length) return [];

    var step = Math.floor(config.step || pixels.step);

    if (!step) return [];

    var chaos = config.chaos / 100;
    var d = pixels.density;
    var srcWidth = pixels.width;
    var srcHeight = pixels.height;
    var low = config.low;
    var high = config.high;

    var dsrcWidth = srcWidth * d;
    var dsrcHeight = srcHeight * d;

    var maxPoints =  dsrcWidth * dsrcHeight * 4;

    /* console.log('collectPointData', dsrcWidth, 'x', dsrcHeight, 'pixels length', srcPixels.length,
                'expected length', maxPoints); */

    var idx, pxBrightness, r, g, b, a;

    var lastPoint;

    var pointData = [];

    var xpos, ypos;


    for (var x = 0; x < srcWidth; x += step) {
        for (var y = 0; y < srcHeight; y += step) {
            // console.log('y', y, pointData.length >= maxPoints);
            pxBrightness = pixelBrightnessByCoords(x, y, srcPixels, srcWidth, d);

            if ((pxBrightness > low) && (random(0, pxBrightness) < high)) {

                xpos = x + random(-step / 2, step / 2) * chaos;
                ypos = y + random(-step / 2, step / 2) * chaos;

                pointData.push([ xpos, ypos, pxBrightness ]);
                if (pointData.length >= maxPoints) break;
            }

        }

    }

    return pointData;
}

// jb/apply-gradient
function applyGradient(p, config, ctx) {
    var palette = config.palette;

    if (!palette) return;

    var width = config.width || window.innerWidth;
    var height = config.height || window.innerHeight;

    //Main gradient
    // --> p.blendMode(p.OVERLAY);
    // p.blendMode(p.NORMAL);
    if (ctx) {
        //var gradient = ctx.createLinearGradient(startGrad1.x, startGrad1.y, endGrad1.x, endGrad1.y);
        // gradient.addColorStop(0, palette[0]);
        // gradient.addColorStop(1, palette[2]);
        var gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0.1, palette[2]);
        gradient.addColorStop(0.5, palette[1]);
        gradient.addColorStop(0.9, palette[0]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    // --> p.blendMode(p.BLEND);
}

// jb/draw-logo
function putLogoAt(ctx, image, x, y) {
    ctx.drawImage(image, x - 870 / 2, y - 55, 870, 110);

}

function drawLogo(p, logo, ctx) {
    if (!logo || !logo.product) return;
    var productId = logo.product;
    // --> p.blendMode(p.NORMAL);
    if (cachedImages[productId + '/logo'] && ctx) {
        putLogoAt(ctx, cachedImages[productId + '/logo'] , logo.x * width, logo.y * height);
    }
}

// jb/edges-squares
function drawEdgesSquares(p, config) {
    var voronoi = config.voronoi;
    var srcPixels = config.pixels.values;
    var srcWidth = config.pixels.width || window.innerWidth;
    var srcHeight = config.pixels.height || window.innerHeight;

    var d = config.pixels.density;

    var dsrcWidth = srcWidth * d;
    var dsrcHeight = srcHeight * d;

    var palette = config.palette;

    var s = config.maxSquareSize;
    p.rectMode(p.CENTER);


    var myEdges = voronoi.edges; //myDelaunay.getEdges();

    var squares = [];

    for (var n = 0; n < myEdges.length; n++) {

        if (!myEdges[n]) continue;
        var startX = myEdges[n][0][0];
        var startY = myEdges[n][0][1];
        var endX = myEdges[n][1][0];
        var endY = myEdges[n][1][1];


        var pxBrightnessStart = Math.floor(pixelBrightnessByCoords(startX, startY, srcPixels, srcWidth, d));
        var pxBrightnessEnd = Math.floor(pixelBrightnessByCoords(endX, endY, srcPixels, srcWidth, d));
        if (!pxBrightnessEnd) {
            pxBrightnessEnd = 0
        }
        ;
        if (!pxBrightnessStart) {
            pxBrightnessStart = 0
        }
        ;

        //  if (pxBrightnessStart & pxBrightnessEnd) {

        //   if(pxBrightnessStart > 80) {console.log(pxBrightnessStart) };
    //   var randomStartSeed = Math.floor(p.random(3));
     //   var randomEndSeed = Math.floor(p.random(3));
      //  var randomEndSeed = randomStartSeed;

       /* while( randomEndSeed != randomStartSeed ) {
            randomEndSeed = Math.floor(p.random(3));
        }
*/

        var randomStartColor = p.random(palette);
        var randomEndColor = p.random(palette);


        /* while (randomStartColor  == randomEndColor) {
            randomEndColor = p.random(palette);
        } */




        var brightnessStart = p.map(pxBrightnessStart, 40, 100, 0, 1);
        var brightnessEnd = p.map(pxBrightnessEnd, 40, 100, 0, 1);
        //var colorStart = p.lerpColor(hexToColor (p, randomStartColor, 200), hexToColor (p, randomStartColor, 255), brightnessStart);
        //var colorEnd = p.lerpColor(hexToColor (p, randomEndColor, 200), hexToColor (p, randomEndColor, 255), brightnessEnd);
        //var colorStart = p.lerpColor(p.color(255, 100), p.color(255, 255), brightnessStart);
        //var colorEnd = p.lerpColor(p.color(255, 100), p.color(255, 255), brightnessEnd);
        var colorStart = p.lerpColor(hexToColor(p, randomStartColor, 100), hexToColor(p, randomStartColor, 255), brightnessStart);
        var colorEnd = p.lerpColor(hexToColor(p, randomEndColor, 100), hexToColor(p, randomEndColor, 255), brightnessEnd);


        //p.strokeWeight(0.8);
        p.strokeWeight(1);
        p.stroke(255);

        // --> p.blendMode(p.SCREEN);

        gradientLine(startX, startY, endX, endY, colorStart, colorEnd);
        //     line(startX, startY, endX, endY);

        squares[n] = {
            x: startX, y: startY,
            size: Math.floor(p.map(pxBrightnessStart, 40, 100, 1, s)),
            //color: /*p.color(p.random(0, 255), p.random(0, 255), p.random(0, 255))*/ p.lerpColor(hexToColor (p, randomStartColor, 100), hexToColor (p, randomStartColor, 255),/*colorStart , p.color(255, 255), */ p.random(0, 1))
            color: (Math.random() < 0.5) ? colorStart : colorEnd
        };

    }

    var square, sqSize;
    for (var n = 0; n < myEdges.length; n++) {
        if (!myEdges[n]) continue;
        square = squares[n];
        sqSize = square.size;
        p.fill(square.color);
        p.noStroke();
        // console.log(pxBrightness);
        //p.ellipse(square.x, square.y, 3, 3);
        p.rect(square.x, square.y, sqSize, sqSize);
    }


       // }

}

// jb/curved-edges
function drawCurvedEdges(p, voronoi) {

    var myEdges = voronoi.edges;

    var startX, startY, endX, endY;

    var randomEdge, randomX, randomY, myDist;

    for (var n = 0; n < myEdges.length; n++) {
        if (!myEdges[n]) continue;
        startX = myEdges[n][0][0];
        startY = myEdges[n][0][1];
        endX = myEdges[n][1][0];
        endY = myEdges[n][1][1];


        randomEdge = Math.floor(p.random(0, myEdges.length));
        if (!myEdges[randomEdge]) continue;
        randomX = myEdges[randomEdge][0][0];
        randomY = myEdges[randomEdge][0][1];

        myDist = p.dist(startX, startY, randomX, randomY);

        if (p.random(0, 1) < 0.3 && (myDist < 500) && (myDist > 400)) {
            p.noFill();
            p.stroke(p.random(100, 255));
            p.strokeWeight(0.3);
            // --> p.blendMode(p.OVERLAY);

            p.bezier(
                startX, startY,
                startX, startY + 500,
                randomX, randomY - 500,
                randomX, randomY
            );
            // --> p.blendMode(p.BLEND);

        }

    }
}

// jb/shapes
function drawShapes(p, config) {
   // return;
    var voronoi = config.voronoi;
    var edges = voronoi.edges;
    var cells = voronoi.cells;
    var palette = config.palette;

    p.smooth();

    p.noStroke();

    //p.blendMode(p.SCREEN);
    var shapes = [];

    var s = 0;

    var minX, minY, maxX, maxY;

    var area;

    var cellEdges;
    var coords;

    var l;

    for (var j = 0; j < cells.length; j++) {
        if (!cells[j]) continue;
        cellEdges = cells[j].halfedges;

        minX = Infinity, minY = Infinity;
        maxX = 0, maxY = 0;

        coords = [];

        for (l = 0; l < cellEdges.length; ++l) {
            coords.push(edges[cellEdges[l]][0]);
            coords.push(edges[cellEdges[l]][1]);
        }

        for (l = 0; l < coords.length; ++l) {
            minX = Math.min(maxX, coords[l][0]);
            minY = Math.min(minY, coords[l][1]);
            maxX = Math.max(maxX, coords[l][0]);
            maxY = Math.max(maxY, coords[l][1]);
        }

        area = (maxX - minX) * (maxY - minY);
        var qty = p.map(config.qty, 0, 1, 0, 5000);
        if (area < qty) {
            shapes.push(coords);
            s++;
        }


        var opacity = p.map(config.opacity, 0, 1, 2, 255);

    }


    for (j = 0; j < shapes.length; j++) {
        if (!shapes[j]) continue;
        var color = Math.floor(p.random(3));
        p.fill(hexToColor (p, palette[color], opacity * p.noise(j)));
        p.beginShape();
        coords = shapes[j];
        for (var l = 0; l < coords.length; ++l) {
            p.vertex(coords[l][0], coords[l][1]);
        }
        p.endShape(p.CLOSE);
    }
}

// jb/back-edges-squares
function drawBackEdgesSquares(p, data) {


    p.rectMode(p.CENTER);


    p.noStroke();
    var point;
    for (var i = 0; i < data.length; i++) {
        point = data[i];

        p.fill(255, 40);

        p.rect(point[0], point[1], 1, 1);

    }
    p.strokeWeight(0.25);
    p.stroke(255, 20);
    // --> p.blendMode(p.OVERLAY);

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data.length; j++) {
            var point1 = data[i];
            var point2 = data[j];
            if (p.dist(point1[0], point1[1], point2[0], point2[1]) < 50) {
                p.line(point1[0], point1[1], point2[0], point2[1]);

            }
        }


    }


}

// jb/dark-gradients
function drawDarkGradients(p, config) {
    var width = config.width || window.innerWidth;
    var height = config.height || window.innerHeight;
    var iris = config.iris;
    var pupilOpacity = config.pupilOpacity;
    var pupilColor = config.pupilColor;

     if (ctx) {
      //   p.blendMode(p.OVERLAY);

        var gradient = ctx.createRadialGradient(width/2, height/2, 4.5 * iris, width/2, height/2, width/2 * iris / 100);
        gradient.addColorStop(0, p.color(pupilColor.r, pupilColor.g, pupilColor.b, pupilOpacity));
        gradient.addColorStop(1, p.color(0));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);



        p.blendMode(p.MULTIPLY);
        var gradient = ctx.createRadialGradient(width/2, height/2, 2 * iris, width/2, height/2, 0.7 * width * iris / 100);
        gradient.addColorStop(0, p.color(pupilColor.r, pupilColor.g, pupilColor.b, pupilOpacity));
        gradient.addColorStop(1, p.color(24, 24, 24));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        p.blendMode(p.NORMAL);
    }
}

function drawBackground(p, config, ctx) {
    var productId = config.product;
    if (!productId) return;
    var width = config.width;
    var height = config.height;
    //p.blendMode(p.NORMAL);
    if (cachedImages[productId + '/bg'] && ctx && productId!='empty0') {
        ctx.save();
        ctx.rotate(config.angle);
        ctx.scale(config.scale, config.scale);
        ctx.drawImage(cachedImages[productId + '/bg'], config.x || 0, config.y || 0, width, height);
        ctx.restore();
        //putLogoAt(ctx,  , logo.x * width, logo.y * height);
    }
}

function pixelBrightnessByCoords(x, y, srcPixels, width, pxDensity) {

    //var idx = (Math.floor(x) + Math.floor(y) * width) * 4 * pxDensity;
    var idx = 4 * ((Math.floor(y) * pxDensity) * width * pxDensity + (Math.floor(x) * pxDensity));

    var r = srcPixels[idx];
    var g = srcPixels[idx + 1];
    var b = srcPixels[idx + 2];
    var a = srcPixels[idx + 3];

    return brightness(color(r, g, b, a));

}
