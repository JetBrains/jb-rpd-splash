var sketchConfig = {
    width: 1000,
    height: 500,
    maxPoints: 5000,
    scale: 1,
    maxSquareSize: 3,
    density: 6,
    inregularity: 0.7,
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

function preload() {
    loadImage(sketchConfig.backImgSrc, function(img) {
        img.loadPixels();
        pointData = collectPointData(sketchConfig, img.pixels, img.width, img.height);
        redraw();
    });

}

function setup() {
    createCanvas(sketchConfig.width, sketchConfig.height).parent('rpd-jb-preview-target');
    noLoop();
    updateSketchConfig(sketchConfig);
}

function draw() {
    clear();

    background(color('#161616'));

    fill(color('white'));
    stroke(color('red'));
    //noStroke();

    //console.log('draw');

    if (pointData && pointData.length) {
        //console.log('pointData', pointData);
        for (var i = 0; i < pointData.length; i++) {
            rect(pointData[i][0], pointData[i][1],
                 10 * (pointData[i][2] / 255),
                 10 * (pointData[i][2] / 255));
        }
    }
}

function updateSketchConfig(newConfig) {
    //console.log(sketchConfig.maxPoints, newConfig.maxPoints);
   loadChangedValuesFrom(newConfig);
   redraw();
  // w = width+16;
  // var xspacing = (conf.xspacing > 0) ? conf.xspacing : 10,
  //     period = (conf.period > 0) ? conf.period : 500;
  // dx = (TWO_PI / conf.period) * xspacing;
  // yvalues = new Array(floor(w/xspacing));
  // start = conf.startcolor ? color(conf.startcolor.r, conf.startcolor.g, conf.startcolor.b)
  //                         : color(255, 255, 255);
  // end = conf.endcolor ? color(conf.endcolor.r, conf.endcolor.g, conf.endcolor.b)
  //                     : color(255, 255, 255);
  // shapefunc = SHAPE_FUNC[conf.shape || 'circle'];
}

function collectPointData(config, pixels, imgWidth, imgHeight) {
    //console.log(config);
    var step = (config.scale || 1) * 12;
    var maxPoints = config.maxPoints;
    var inregularity = config.inregularity;

    var width = config.width;
    var height = config.height;

    var idx, pxBrightness, r, g, b, a;

    var lastPoint;

    var pointData = [];

    var xpos, ypos;

    //var d = pixelDensity();

    //console.log('maxPoints', maxPoints);

    //console.log('imgWidth', imgWidth, 'imgHeight', imgHeight, 'step', step);

    for (var x = 0; x < imgWidth; x += step) {

        //console.log('x', x, pointData.length >= maxPoints);

        if (pointData.length >= maxPoints) break;

        for (var y = 0; y < imgHeight; y += step) {

            //console.log('y', y, pointData.length >= maxPoints);

            if (pointData.length >= maxPoints) break;

            idx = (x + y * width) * 4;

            r = pixels[idx];
            g = pixels[idx+1];
            b = pixels[idx+2];
            a = pixels[idx+3];

            pxBrightness = brightness(color(r, g, b, a));

            //console.log('x', x, 'y', y, 'r', r, 'g', g, 'b', b, 'a', a, 'brightness', pxBrightness);

            if ((pxBrightness > 3) && (random(0, pxBrightness) < 70)) {

                xpos = ((x / imgWidth) * width) + (random(-step / 2, step / 2) * inregularity);
                ypos = ((y / imgHeight) * height) + (random(-step / 2, step / 2) * inregularity);

                pointData.push([ xpos, ypos, pxBrightness ]);
            }

        }

    }

    //console.log(pointData.length, pointData);

    return pointData;
}
