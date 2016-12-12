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

var backImg, grad, my;

var lastPoint;

var pointData = [];

function preload() {
    loadImage(sketchConfig.backImgSrc, function(img) {
        img.loadPixels();
        pointData = collectPointData(sketchConfig, img.pixels, img.width, img.height);
    });

}

function setup() {
    createCanvas(sketchConfig.width, sketchConfig.height).parent('rpd-jb-preview-target');
    noLoop();
    updateWithConfig(sketchConfig);
}

function draw() {
    background(0x161616);

    if (pointData && pointData.length) {
        for (var i = 0; i < pointData.length; i++) {
            rect(pointData[i][0], pointData[i][1],
                 10 * (pointData[i][2] / 255),
                 10 * (pointData[i][2] / 255));
        }
    }
}

function updateWithConfig(newConfig) {
  sketchConfig = newConfig;
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
    var step = config.step;
    var maxPoints = config.maxPoints;
    var inregularity = config.inregularity;

    var width = config.width;
    var height = config.height;

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
