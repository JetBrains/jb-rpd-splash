var sketchConfig = {};

function setup() {
    var myCanvas = createCanvas(400, 300);
    myCanvas.parent('p5-canvas');
    updateWithConfig(sketchConfig);
}

function updateWithConfig(conf) {
}

function draw() {
  ellipse(50, 50, 80, 80);
}
