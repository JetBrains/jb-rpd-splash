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
function initNoiseSketch() {

    var refresher;
    //var values = Kefir.emitter();

    function refreshSketch(inlets) {
        return refresher ? refresher(inlets) : EMPTY_PIXELS;
    }

    var noiseSketch = function(p) {
        var width = window.innerWidth;
        var height = window.innerHeight;

        var setupCalled = false;

        var cvs;

        p.setup = function() {
            cvs = p.createCanvas(width, height).parent('rpd-jb-preview-target');
            //cvs.position(-5000, -5000);
            cvs.canvas.className = 'noise-canvas';
            cvs.canvas.style.display = 'none';
            // console.log(cvs);
            //cvs.style.display = 'none';
            p.noLoop();
            p.background(p.color(0, 0, 0, 0));
            setupCalled = true;
        };

        var lastPixels;
        var lastSeed;
        var lastValues;
        var lastStep;
        refresher = function(inlets) {
            if (!setupCalled) return;
            p.noiseDetail(inlets.octave, inlets.falloff);
            lastSeed = p.random(1000);
            lastStep = inlets.grain;
            p.noiseSeed(lastSeed);
            p.redraw();
            return lastPixels;
        };

        p.draw = function() {
            p.clear();
            p.noStroke();
            //lastValues = [];
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
            p.loadPixels();
            lastPixels = {
                width: width,
                height: height,
                values: p.pixels,
                canvas: cvs.canvas,
                //values: lastValues,
                step: lastStep || 10,
                time: new Date(),
                density: p.pixelDensity(),
                seed: lastSeed
            };
        };
    };

    /*var noiseP5 =*/ new p5(noiseSketch);

    return refreshSketch;

}

// jb/background
function initBackgroundSketch() {

    var refresher;
    //var values = Kefir.emitter();

    function refreshSketch(inlets) {
        return refresher ? refresher(inlets) : EMPTY_PIXELS;
    }

    var backgroundSketch = function(p) {
        var width = window.innerWidth;
        var height = window.innerHeight;

        var setupCalled = false;

        var ctx;
        var cvs;

        p.setup = function() {
            cvs = p.createCanvas(width, height).parent('rpd-jb-preview-target');
            //cvs.position(-5000, -5000);
            cvs.canvas.className = 'background-canvas';
            cvs.canvas.style.display = 'none';
         //  console.log(cvs);
            //cvs.style.display = 'none';

            ctx = cvs.drawingContext;
            p.noLoop();
            setupCalled = true;
        };

        var lastConfig;
        var lastPixels;
        refresher = function(inlets) {
            if (!setupCalled) return;
            lastConfig = inlets;
            p.redraw();
            return lastPixels;
        };

        p.draw = function() {
            if (!lastConfig) return;

            p.clear();
            //lastValues = [];

            drawBackground(p, lastConfig, ctx);

            p.loadPixels();
            lastPixels = {
                width: lastConfig.width,
                height: lastConfig.height,
                values: p.pixels,
                //values: lastValues,
                canvas: cvs.canvas,
                step: -1,
                time: new Date(),
                density: p.pixelDensity(),
                seed: -1
            };
        };
    };

    /*var backgroundP5 =*/ new p5(backgroundSketch);

    return refreshSketch;

}

// jb/draw-pixels
function drawPixels(p, config, ctx, renderOptions) {
    var pixels = config.pixels;
    var blur = config.blur;
    var contrast = Math.floor(config.contrast * 255);

    var opacity = renderOptions.opacity;

    if (!pixels) return;

    p.push();

    //if (opacity) ctx.globalAlpha = opacity;

    ctx.drawImage(pixels.canvas, 0, 0, pixels.width, pixels.height);

    p.loadPixels();

    var src = pixels.values; // pixels.values
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

    for (var n = 0; n < myEdges.length; n++) {
        if (!myEdges[n]) continue;
        var startX = myEdges[n][0][0];
        var startY = myEdges[n][0][1];
        var endX = myEdges[n][1][0];
        var endY = myEdges[n][1][1];


        var pxBrightnessStart = Math.floor(pixelBrightnessByCoords(startX, startY, srcPixels, srcWidth, d));
        var pxBrightnessEnd = Math.floor(pixelBrightnessByCoords(endX, endY, srcPixels, srcWidth, d));
        if(!pxBrightnessEnd) { pxBrightnessEnd = 0 };
        if(!pxBrightnessStart) { pxBrightnessStart = 0 };

      //  if (pxBrightnessStart & pxBrightnessEnd) {
            var colX = p.map(pxBrightnessStart, 0, 100, 0, 1);
            var colY = p.map(pxBrightnessEnd, 0, 100, 0, 1);
            var colcolX = p.lerpColor(p.color(palette[2]), p.color(palette[0]), colX);
            var colcolY = p.lerpColor(p.color(palette[2]), p.color(palette[0]), colY);


            p.strokeWeight(0.8);
            p.stroke(255);

            // --> p.blendMode(p.SCREEN);

            gradientLine(startX, startY, endX, endY, colcolX, colcolY);
           //     line(startX, startY, endX, endY);


            var sqSize = Math.floor(p.map(pxBrightnessStart, 40, 100, 1, s));
            p.fill(p.lerpColor(colcolX, p.color(255), p.random(0, 1)));
            p.noStroke();
            // console.log(pxBrightness);
            p.rect(startX, startY, sqSize, sqSize);



       // }


    }

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

        myDist = p.dist(startX, startY, randomX, randomY)

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
function drawShapes(p, voronoi) {
    var edges = voronoi.edges;
    var cells = voronoi.cells;

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

        if (area < 2000) {
            shapes.push(coords);
            s++;
        }

    }

    for (j = 0; j < shapes.length; j++) {
        if (!shapes[j]) continue;
        p.fill(p.color(255, 0, 0, p.random(2, 255)));
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
    if (cachedImages[productId + '/bg'] && ctx) {
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
