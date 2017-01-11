var sketchConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    bgcolor: _rgb(24, 24, 24),
    layers: []
    //backImgSrc: 'http://localhost:8000/experiment_bg.png'
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
        if (layers[i] && layers[i] != 'dark') {
            console.time(layers[i].name || 'layer-' + i);
            layers[i].func(this, layers[i].conf, ctx);
            console.timeEnd(layers[i].name || 'layer-' + i);
        }
    }

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
