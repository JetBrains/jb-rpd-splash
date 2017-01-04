var imagesToLoad = PRODUCTS.map(function(product) {
    return {
        product: product.id,
        path: 'logos/' + product.id + '-text-square.svg'
    };
});

var sketchConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    srcPixels: null,
    maxPoints: window.innerWidth * window.innerHeight,
    scale: 1,
    bgcolor: _rgb(24, 24, 24),
    palette: [
        '#ff0000',
        '#00ff00',
        '#0000ff'
    ],
    logo: null,
    maxSquareSize: 15,
    density: 6,
    irregularity: 0.5,
    step: 16,
    backImgSrc: 'http://localhost:8000/experiment_bg.png'
};

function loadChangedValuesFrom(newConfig) {
    Object.keys(newConfig).forEach(function(key) {
        if (newConfig[key]) sketchConfig[key] = newConfig[key];
    });
}

var backImg, grad, my;

var lastPoint;

var pointData = [];

var canvas, ctx;

var productsImages = {};

var pxDensity;

function preload() {
    console.log('preload');

    pxDensity = pixelDensity();
    // loadImage(sketchConfig.backImgSrc, function (img) {
    //     img.loadPixels();
    //     lastBgImage = img;
    //     pointData = collectPointData(sketchConfig, img.pixels);
    //     console.log('image loaded');
    //     redraw();
    //     var loader = document.getElementById('loader');
    //     if (loader) {
    //         loader.style.opacity = 0;
    //     }
    // });
    var readyImgCount = 0;
    imagesToLoad.forEach(function(imgSpec) {
        console.log('start loading image for', imgSpec.product);
        loadImage(imgSpec.path, function(img) {
            console.log('started loading', imgSpec.path);
            productsImages[imgSpec.product] = img;
            readyImgCount++;
            console.log('images ready:', readyImgCount + '/' + imagesToLoad.length);
            if (readyImgCount == imagesToLoad.length) {
                console.log('finished loading images');
            }
            /*
            var img = new Image();
            img.onload = function() {
                productsImages[productId] = img;
                putLogoAt(ctx, productsImages[productId], logo.x * width, logo.y * height);
            };
            img.src = imagePath;
            */
        }, function() {
            console.log('image at ' + imgSpec.path + ' failed to load');
            readyImgCount++;
            console.log('images ready:', readyImgCount + '/' + imagesToLoad.length);
            if (readyImgCount == imagesToLoad.length) {
                console.log('finished loading images');
            }
        });
    });
}

function setup() {
    console.log('setup');


    var bgcolor = sketchConfig.bgcolor;
    background(color(bgcolor.r, bgcolor.g, bgcolor.b));
    clear();

    d3.select('#rpd-jb-preview-target').selectAll('.sketch-canvas').remove();
    canvas = createCanvas(sketchConfig.width, sketchConfig.height).parent('rpd-jb-preview-target');
    canvas.canvas.className = 'sketch-canvas';
    canvas.canvas.style.visibility = 'visible';
    ctx = canvas.drawingContext;
    noLoop();
    updateSketchConfig(sketchConfig);

}

function draw() {
    console.log('draw');

    clear();

    if (!sketchConfig.srcPixels) return;

    // if (loadingImages) {
    //     drawLoading();
    //     return;
    // }

    //var sketchWidth = sketchConfig.width;
    //var sketchHeight = sketchConfig.height;

    noStroke();

    var srcPixels = sketchConfig.srcPixels;

    pointData = collectPointData(sketchConfig,
                                 srcPixels.pixels,
                                 srcPixels.width,
                                 srcPixels.height);

    if (!pointData || !pointData.length) return;

    //noStroke();


    var xRect = width / 2;
    var yRect = height / 2;

    var rotation1 = map(50, 0, 100, 0, width);
    var rotation2 = map(50, 0, 100, 0, height);
    var location = map(0, 50, 100, 0, width);


    var startGrad1 = createVector(xRect + rotation1 + location, yRect + height - rotation2 - location);
    var endGrad1 = createVector(xRect + width - rotation1 - location, yRect + rotation2 + location);

    //Main gradient
    blendMode(OVERLAY);
    if (ctx) {
        var gradient = ctx.createLinearGradient(startGrad1.x, startGrad1.y, endGrad1.x, endGrad1.y);
        gradient.addColorStop(0, sketchConfig.palette[0]);
        gradient.addColorStop(1, sketchConfig.palette[2]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    blendMode(BLEND);

    if (pointData && pointData.length) {

        var voronoi = d3.voronoi()
            .size([width, height])
            (pointData);

        // sketchConfig.layers = [
        //     function() { rect(...); },
        //     function() { circle(...); },
        //     function() { circle(...); }
        // ];
        //
        // sketchConfig.layers.forEach(function(layer) {
        //     layer();
        //
        // });

        drawCurvedEdges(voronoi, sketchConfig);
        drawShapes(voronoi, sketchConfig);
        drawEdgesSquares(voronoi, srcPixels.pixels, srcPixels.width, srcPixels.height,
                                  sketchConfig);
        drawBackEdgesSquares(pointData, sketchConfig);
        blendMode(NORMAL);
        drawLogo(sketchConfig.logo);


    }
}

function updateSketchConfig(newConfig) {

    var recalcPoints = (newConfig.irregularity || newConfig.maxPoints || newConfig.width || newConfig.height) ? true : false;
    loadChangedValuesFrom(newConfig);
    // if (recalcPoints && lastBgImage) {
    //     pointData = collectPointData(sketchConfig, lastBgImage.pixels, lastBgImage.width, lastBgImage.height);
    // }
    //noiseSeed(random(1000));
    redraw();
}

function collectPointData(config, srcPixels, srcWidth, srcHeight) {

    if (!srcPixels || !srcPixels.length) return [];

    var step = Math.floor(config.step);
    var maxPoints = config.maxPoints;
    var chaos = config.irregularity;

    srcWidth = srcWidth ? srcWidth * pxDensity : config.width * pxDensity;
    srcHeight = srcHeight ? srcHeight * pxDensity : config.height * pxDensity;

    console.log('collectPointData', srcWidth, 'x', srcHeight, 'pixels length', srcPixels.length,
                'expected length', srcHeight * srcWidth * 4);

    var idx, pxBrightness, r, g, b, a;

    var lastPoint;

    var pointData = [];

    var xpos, ypos;


    for (var x = 0; x < srcWidth; x += step) {

        if (pointData.length >= maxPoints) break;

        for (var y = 0; y < srcHeight; y += step) {

            // console.log('y', y, pointData.length >= maxPoints);

            if (pointData.length >= maxPoints) break;

            pxBrightness = pixelBrightnessByCoords(x, y, srcPixels,  srcWidth);

            if ((pxBrightness > 40) && (random(0, pxBrightness) < 30)) {

                xpos = x + random(-step / 2, step / 2) * chaos;
                ypos = y + random(-step / 2, step / 2) * chaos;

                pointData.push([ xpos, ypos, pxBrightness ]);
            }

        }

    }

    return pointData;
}

function drawEdgesSquares(voronoi, srcPixels, srcWidth, srcHeight, config) {

    srcWidth = srcWidth * pxDensity;
    srcHeight = srcHeight * pxDensity;

    var palette = config.palette;

    var s = config.maxSquareSize;
    rectMode(CENTER);


    var myEdges = voronoi.edges; //myDelaunay.getEdges();

    for (var n = 0; n < myEdges.length; n++) {
        if (!myEdges[n]) continue;
        var startX = myEdges[n][0][0];
        var startY = myEdges[n][0][1];
        var endX = myEdges[n][1][0];
        var endY = myEdges[n][1][1];


        var pxBrightnessStart = Math.floor(pixelBrightnessByCoords(startX, startY, srcPixels, srcWidth));
        var pxBrightnessEnd = Math.floor(pixelBrightnessByCoords(endX, endY, srcPixels, srcWidth));
        if (pxBrightnessStart & pxBrightnessEnd) {
            var colX = map(pxBrightnessStart, 0, 100, 0, 1);
            var colY = map(pxBrightnessEnd, 0, 100, 0, 1);
            var colcolX = lerpColor(color(config.palette[2]), color(config.palette[0]), colX);
            var colcolY = lerpColor(color(config.palette[2]), color(config.palette[0]), colY);


            strokeWeight(0.8);
            stroke(255);

            blendMode(SCREEN);

            gradientLine(startX, startY, endX, endY, colcolX, colcolY);
            //    line(startX, startY, endX, endY);


            var sqSize = Math.floor(map(pxBrightnessStart, 40, 100, 1, s));
            fill(lerpColor(colcolX, color(255), random(0, 1)));
            noStroke();
            // console.log(pxBrightness);
            rect(startX, startY, sqSize, sqSize);


        }


    }

}


function drawBackEdgesSquares(data, config) {


    rectMode(CENTER);


    noStroke();
    for (var i = 0; i < data.length; i++) {
        var point = data[i];

        fill(255, 40);

        rect(point[0], point[1], 1, 1);

    }
    strokeWeight(0.25);
    stroke(255, 20);
    blendMode(OVERLAY);

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data.length; j++) {
            var point1 = data[i];
            var point2 = data[j];
            if (dist(point1[0], point1[1], point2[0], point2[1]) < 50) {
                line(point1[0], point1[1], point2[0], point2[1]);

            }
        }


    }


}

function drawShapes(voronoi, config) {
    var edges = voronoi.edges;
    var cells = voronoi.cells;

    smooth();

    noStroke();

    //blendMode(SCREEN);
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
        fill(color(255, random(2, 20)));
        beginShape();
        coords = shapes[j];
        for (var l = 0; l < coords.length; ++l) {
            vertex(coords[l][0], coords[l][1]);
        }
        endShape(CLOSE);
    }
}


function gradientLine(x1, y1, x2, y2, color1, color2) {

    if (ctx) {
        var grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);

        ctx.strokeStyle = grad;


        line(x1, y1, x2, y2);
    }
}


function drawCurvedEdges(voronoi, config) {

    var myEdges = voronoi.edges;

    for (var n = 0; n < myEdges.length; n++) {
        if (!myEdges[n]) continue;
        var startX = myEdges[n][0][0];
        var startY = myEdges[n][0][1];
        var endX = myEdges[n][1][0];
        var endY = myEdges[n][1][1];


        var randomEdge = Math.floor(random(0, myEdges.length));
        if (!myEdges[randomEdge]) continue;
        var randomX = myEdges[randomEdge][0][0];
        var randomY = myEdges[randomEdge][0][1];


        if (random(0, 1) < 0.3 && dist(startX, startY, randomX, randomY) < 500 && dist(startX, startY, randomX, randomY) > 400) {
            noFill();
            stroke(random(100, 255));
            strokeWeight(0.3);
            blendMode(OVERLAY);

            bezier(
                startX, startY,
                startX, startY + 500,
                randomX, randomY - 500,
                randomX, randomY
            );
            blendMode(BLEND);


        }

    }
}



function pixelBrightnessByCoords(x, y, srcPixels, width) {

    var idx = (Math.floor(x) + Math.floor(y) * width) * 4/* * pxDensity*/;

    var r = srcPixels[idx];
    var g = srcPixels[idx + 1];
    var b = srcPixels[idx + 2];
    var a = srcPixels[idx + 3];

    return brightness(color(r, g, b, a));

}

var LOGO_PX_SIDE = 60;
var LOGO_PX_SHIFT = -50;

function putLogoAt(ctx, image, x, y) {
    ctx.drawImage(image, x - 870 / 2, y - 55, 870, 110);
}

function drawLogo(logo) {
    if (!logo) return;
    var productId = logo.product;
    if (!productId) return;
    var imagePath = 'logos/' + productId + '-text-square.svg';
    if (productsImages[productId] && ctx) {
            image(productsImages[productId], 0, 0);//width/2 -870/2, height/2 -55, 870, 110);
            //putLogoAt(ctx, productsImages[productId], logo.x * width, logo.y * height);

    }
}

function drawLoading() {
    text('loading', 0, 0);
}
