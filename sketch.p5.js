var sketchConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    srcPixels: null,
    bgcolor: _rgb(24, 24, 24),
    layers: [],
    palette: [
        '#ff0000',
        '#00ff00',
        '#0000ff'
    ],
    logo: null,
    maxSquareSize: 15,
    density: 6,
    chaos: 0.5,
    step: 16,
    backImgSrc: 'http://localhost:8000/experiment_bg.png'
};

var loaderShown = false;

function showLoader() {
    console.log('+++++ showLoader');
    //setTimeout(function() {
        d3.select('#loader-wrapper').style('opacity', 1);
        loaderShown = true;
    //}, 1);
}

function hideLoader() {
    console.log('+++++ hideLoader');
    //setTimeout(function() {
        d3.select('#loader-wrapper').style('opacity', 0);
        loaderShown = false;
    //}, 1);
}

function loadChangedValuesFrom(newConfig) {
    Object.keys(newConfig).forEach(function(key) {
        if (newConfig[key]) sketchConfig[key] = newConfig[key];
    });
}

var backImg, grad, my;

var lastPoint;

var pointData = [];

var canvas, ctx;



var pxDensity;

var lastPixelsTime, lastPointData;

function preload() {
  //  console.log('preload');

    showLoader();

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
    loadSketchImages();
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
    updateSketchConfig(sketchConfig, true);

}

function draw() {
    console.log('draw');

    clear();

    var layers = sketchConfig.layers;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i]) layers[i].func(this, layers[i].conf, ctx);
    }


    // console.timeEnd('apply incoming pixels');

    // console.time('collectPointData');
    // if (srcPixels.time === lastPixelsTime) {
    //     pointData === lastPointData;
    // } else {
    //     lastPixelsTime = srcPixels.time;
    //     pointData = collectPointData(sketchConfig,
    //                                 srcPixels.pixels,
    //                                 srcPixels.width,
    //                                 srcPixels.height);
    //     lastPointData = pointData;
    // }
    // console.timeEnd('collectPointData');

    // if (!pointData || !pointData.length) {
    //     hideLoader();
    //     return;
    // }

    // console.time('gradient');

    // var xRect = width / 2;
    // var yRect = height / 2;

    // var rotation1 = map(50, 0, 100, 0, width);
    // var rotation2 = map(50, 0, 100, 0, height);
    // var location = map(0, 50, 100, 0, width);


    // var startGrad1 = createVector(xRect + rotation1 + location, yRect + height - rotation2 - location);
    // var endGrad1 = createVector(xRect + width - rotation1 - location, yRect + rotation2 + location);

    // //Main gradient
    // blendMode(OVERLAY);
    // if (ctx) {
    //     var gradient = ctx.createLinearGradient(startGrad1.x, startGrad1.y, endGrad1.x, endGrad1.y);
    //     gradient.addColorStop(0, sketchConfig.palette[0]);
    //     gradient.addColorStop(1, sketchConfig.palette[2]);
    //     ctx.fillStyle = gradient;
    //     ctx.fillRect(0, 0, width, height);
    // }
    // blendMode(BLEND);

    // console.timeEnd('gradient');

    // if (pointData && pointData.length) {

    //     console.time('voronoi');

    //     var voronoi = d3.voronoi()
    //         .size([width, height])
    //         (pointData);

    //     console.timeEnd('voronoi');

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

        // console.time('drawCurvedEdges');
        // drawCurvedEdges(voronoi, sketchConfig);
        // console.timeEnd('drawCurvedEdges');
        // console.time('drawShapes');
        // drawShapes(voronoi, sketchConfig);
        // console.timeEnd('drawShapes');
        // console.time('drawEdgesSquares');
        // drawEdgesSquares(voronoi, srcPixels.pixels, srcPixels.width, srcPixels.height,
        //                           sketchConfig);
        // console.timeEnd('drawEdgesSquares');
        // console.time('drawBackEdgesSquares');
        // drawBackEdgesSquares(pointData, sketchConfig);
        // console.timeEnd('drawBackEdgesSquares');
        // blendMode(NORMAL);
        // console.time('drawLogo');
        // drawLogo(sketchConfig.logo);
        // console.timeEnd('drawLogo');

    // }

    // hideLoader();
}

var updateStream = Kefir.emitter();
updateStream.filter(function(value) {
                //return value.config.srcPixels && value.config.srcPixels.pixels.length && value.config.logo && value.config.logo.product;
                return value.config.layers && (value.config.layers.length > 0);
            })
            .throttle(5000, { leading: false })
            .onValue(function(value) {
                loadChangedValuesFrom(value.config);
                if (!value.noRedraw) redraw();
            });


function updateSketchConfig(newConfig, noRedraw) {

    //var recalcPoints = (newConfig.chaos ||  newConfig.width || newConfig.height) ? true : false;
    loadChangedValuesFrom(newConfig);


    //var recalcPoints = (newConfig.irregularity || newConfig.maxPoints || newConfig.width || newConfig.height) ? true : false;
    //loadChangedValuesFrom(newConfig);
    // if (recalcPoints && lastBgImage) {
    //     pointData = collectPointData(sketchConfig, lastBgImage.pixels, lastBgImage.width, lastBgImage.height);
    // }
    //noiseSeed(random(1000));
    //if (!noRedraw) redraw();

    updateStream.emit({
        config: newConfig,
        noRedraw: noRedraw
    });
}

function drawBackEdgesSquares(data, config) {


    rectMode(CENTER);


    noStroke();
    var point;
    for (var i = 0; i < data.length; i++) {
        point = data[i];

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

function gradientLine(x1, y1, x2, y2, color1, color2) {

    if (ctx) {
        var grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);

        ctx.strokeStyle = grad;


        line(x1, y1, x2, y2);
    }
}

function drawLoading() {
    text('loading', 0, 0);
}
