var sketchConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    maxPoints: 5000,
    scale: 1,
    maxSquareSize: 3,
    density: 6,
    inregularity: 0.7,
    step: 12,
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

var lastBgImage;

function preload() {
    loadImage(sketchConfig.backImgSrc, function(img) {
        img.loadPixels();
        lastBgImage = img;
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
        /*for (var i = 0; i < pointData.length; i++) {
            rect(pointData[i][0], pointData[i][1],
                 10 * (pointData[i][2] / 255),
                 10 * (pointData[i][2] / 255));
        }*/

        var voronoi = d3.voronoi()
                        .size([sketchConfig.width, sketchConfig.height])
                        (pointData);

        if (lastBgImage) {
            image(lastBgImage, 0, 0, sketchConfig.width, sketchConfig.height);
        }

        //drawPolygons(voronoi, sketchConfig);
        drawEdges(voronoi, sketchConfig);
        drawShapes(voronoi, sketchConfig);

        if (lastBgImage) {
            drawLines(voronoi, sketchConfig, lastBgImage.pixels, lastBgImage.width, lastBgImage.height);
        }
    }
}

function updateSketchConfig(newConfig) {
    //console.log(sketchConfig.maxPoints, newConfig.maxPoints);
    var recalcPoints = (newConfig.inregularity || newConfig.maxPoints || newConfig.width || newConfig.height) ? true : false;
    loadChangedValuesFrom(newConfig);
    if (recalcPoints && lastBgImage) {
        pointData = collectPointData(sketchConfig, lastBgImage.pixels, lastBgImage.width, lastBgImage.height);
    }
    redraw();
}

function collectPointData(config, pixels, imgWidth, imgHeight) {
    //console.log(config);
    var step = (config.scale || 1) * Math.floor(config.step);
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

            idx = pixelIndexByCoords(x, y, imgWidth, imgHeight/*, density*/);

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

function drawPolygons(voronoi, config) {
    var polygons = voronoi.polygons();

    var vcolors = [
                   color(197,27,125), color(222,119,174), color(241,182,218),
                   color(253,224,239), color(247,247,247), color(230,245,208),
                   color(184,225,134), color(127,188,65), color(77,146,33)
                  ];

    stroke(255);

    // draw polygons
    for (var j = 0; j < polygons.length; j++) {
        var polygon = polygons[j];

        if (!polygon) continue;

        // pick a random color
        var polyColor = vcolors[j % vcolors.length];
        fill(polyColor);

        beginShape();

        for (var k = 0; k < polygon.length; k++) {

          var v = polygon[k];
          vertex(v[0], v[1]);

        }

        endShape(CLOSE);
    }

    // draw circles.

    var circles = pointData.slice(1);

    stroke(0);
    for (var i = 0 ; i < circles.length; i++) {
        var center = circles[i];
        push();
        translate(center[0], center[1]);
        fill(0);
        ellipse(0, 0, 1.5, 1.5);
        pop();
    }

}

function drawEdges(voronoi, config) {
    var scale = config.scale;

    rectMode(CENTER);

    strokeWeight(0.4);
    //console.log(voronoi.triangles());
    var myEdges = voronoi.edges; //myDelaunay.getEdges();

    for (var n=0; n<myEdges.length; n++) {
        if (!myEdges[n]) continue;
        var startX = myEdges[n][0][0];
        var startY = myEdges[n][0][1];
        var endX = myEdges[n][1][0];
        var endY = myEdges[n][1][1];
        stroke(random(70,180));
        if(dist(startX, startY, endX, endY) < 50) {

            line(startX, startY, endX, endY);
        }
        var squareSize = Math.floor(random(1,3)*scale);
        fill(random(90,180));
        rect(startX, startY, squareSize, squareSize);
    }

    noStroke();
}

function drawShapes(voronoi, config) {
    var edges = voronoi.edges;
    var cells = voronoi.cells;

    smooth();

    noStroke();

    //blendMode(SCREEN);
    var shapes = [];
   // int[] colors = {0xccd5df, 0x8da3b2, 0x6f899f, 0x3b5778, 0xd6dfe6};

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
        fill(color(random(255)), random(40, 80));
        beginShape();
        coords = shapes[j];
        for (var l = 0; l < coords.length; ++l) {
            vertex(coords[l][0], coords[l][1]);
        }
        endShape(CLOSE);
    }
}

function drawLines(voronoi, config, pixels, imgWidth, imgHeight) {

    var edges = voronoi.edges;
    var cells = voronoi.cells;

    var width = config.width;
    var height = config.height;

    //blendMode(SCREEN);
    var shapes = [];
   // int[] colors = {0xccd5df, 0x8da3b2, 0x6f899f, 0x3b5778, 0xd6dfe6};

    var s = 0;

    var cellEdges;

    var l;

    var pxBrightness, startX, startY, endX, endY;

    var idx, r, g, b, a;

    for (var j = 0; j < cells.length; j++) {
        if (!cells[j]) continue;
        cellEdges = cells[j].halfedges;

        for (l = 0; l < cellEdges.length; l += 2) {
            if (!cellEdges[l] || !cellEdges[l + 1]) continue;

            startX = edges[cellEdges[l]][0];
            startY = edges[cellEdges[l]][1];
            endX = edges[cellEdges[l + 1]][0];
            endY = edges[cellEdges[l + 1]][1];

            idx = pixelIndexByCoords(Math.floor(startX), Math.floor(startY), imgWidth, imgHeight/*, density*/);

            r = pixels[idx];
            g = pixels[idx+1];
            b = pixels[idx+2];
            a = pixels[idx+3];

            pxBrightness = brightness(color(r, g, b, a));

            strokeWeight(map(pxBrightness, 0, 255, 0.4, 0.6));
            stroke(map(pxBrightness, 0, 255, 100, 255));
            line(startX, startY,
                 endX, endY);
        }



    }

}

function pixelIndexByCoords(x, y, width, height, density) {
    return (x + y * width) * 4;
}
