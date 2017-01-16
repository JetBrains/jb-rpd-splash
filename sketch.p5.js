var sketchConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    bgcolor: _rgb(24, 24, 24),
    layers: []
    //backImgSrc: 'http://localhost:8000/experiment_bg.png'
};

function showLoaderAt(pos) {
    //console.log('+++++ showLoaderAt ', pos);
    //setTimeout(function() {
        d3.select('#loader-wrapper').style('opacity', 1);
        d3.select('#loader-wrapper p').text('Rendering... ' + Math.floor(pos * 100) + '%');
        d3.select('#loading-bar').style('width', Math.floor(pos * 100) + '%');
    //}, 1);
}

function hideLoader() {
    //console.log('+++++ hideLoader');
    //setTimeout(function() {
        d3.select('#loader-wrapper').style('opacity', 0);
        d3.select('#loading-bar').style('width', '0%');
    //}, 1);
}

function loadChangedValuesFrom(newConfig) {
    Object.keys(newConfig).forEach(function(key) {
        if (newConfig[key]) sketchConfig[key] = newConfig[key];
    });
}

var canvas, ctx;

var pxDensity;

var lastPixelsTime, lastPointData;

var loadingResources = false;

var BLEND_TO_P5;

function preload() {
    if (loadingResources) return;
  //  console.log('preload');

    pxDensity = pixelDensity();
    loadingResources = true;
    loadSketchImages(this, function() {
        loadingResources = false;
    });

}

function setup() {
    //console.log('setup');


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
    if (loadingResources) return;

    //console.log('draw');

    showLoaderAt(0, 'Rendering');

    BLEND_TO_P5 = {
        N: 'NORMAL',
        B: 'BLEND',
        A: 'ADD',
        K: 'DARKEST',
        L: 'LIGHTEST',
        D: 'DIFFERENCE',
        X: 'EXCLUSION',
        M: 'MULTIPLY',
        S: 'SCREEN',
        R: 'REPLACE',
        O: 'OVERLAY',
        H: 'HARD_LIGHT',
        F: 'SOFT_LIGHT',
        G: 'DODGE',
        U: 'BURN'
    };

    var p5 = this;

    // ==========
    // faster version, just ensures loading bar is shown, usually it stays at 0% until the end,
    // since GPU is busy with drawing layers

    // setTimeout(function() {
    //     clear();

    //     var layers = sketchConfig.layers;
    //     for (var i = 0; i < layers.length; i++) {
    //         if (layers[i] && layers[i] != 'dark') {
    //             showLoaderAt((i + 1) / layers.length, 'Rendering');
    //             console.time(layers[i].name || 'layer-' + i);
    //             layers[i].func(p5, layers[i].conf, ctx);
    //             console.timeEnd(layers[i].name || 'layer-' + i);
    //         }
    //         if (i == (layers.length - 1)) hideLoader();
    //     }

    //     hideLoader();
    // }, 10);

    // ==========
    // a tiny bit slower version, ensures to show loading bar for every step by waiting 10msec
    // between calls to free up GPU

    var layersToRender = sketchConfig.layers;

    var drawLayer = Kefir.emitter();

    var p5 = this;
    clear();

    drawLayer.delay(10).onValue(function(v) {
        showLoaderAt((v.index + 1) / layersToRender.length, 'Rendering');
        var layer = v.layer;
        //console.time(layer.name || 'layer-' + v.index);
        applyRenderOptions(p5, v.renderOptions, v.index);
        layer.func(p5, layer.conf, ctx);
        resetRenderOptions(p5);
        //console.timeEnd(layer.name || 'layer-' + v.index);
        if (v.index == (layersToRender.length - 1)) hideLoader();
    });

    for (var i = 0; i < layersToRender.length; i++) {
        drawLayer.emit({
            index: i,
            layer: layersToRender[i][0],
            renderOptions: layersToRender[i][1]
        });
    }
}

function applyRenderOptions(p, options, index) {
    var layerBlendMode = options.blendMode;
    if (layerBlendMode) {
        //console.log('apply blend mode', index, layerBlendMode, BLEND_TO_P5[layerBlendMode]);
        p.blendMode(p[BLEND_TO_P5[layerBlendMode]]);
    } else {
        //console.log('apply blend mode', index, '', 'NORMAL');
        p.blendMode(p.NORMAL);
    }
    //p.opacity(options.opacity);
    ctx.globalAlpha = options.opacity;
}

function resetRenderOptions(p) {
    //p.blendMode(p.NORMAL);
    //p.opacity(1);
    ctx.globalAlpha = 1;
}

var updateStream = Kefir.emitter();
updateStream.filter(function(value) {
                //return value.config.srcPixels && value.config.srcPixels.pixels.length && value.config.logo && value.config.logo.product;
                return value.config.layers && (value.config.layers.length > 0);
            })
            .throttle(1000, { leading: false })
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
