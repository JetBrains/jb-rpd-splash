function initP5(getForms, w, h) {
    return function(p) {
        p.setup = function() {
            var c = p.createCanvas(w, h);
            c.addClass('p5-canvas');
            p.noLoop();
        };
        p.draw = function() {
            p.clear();
            p.background(0, 0);
            drawForms(p, getForms() || []);
        };
    }
}

function drawForms(p, forms) {
    forms.forEach(function(formF) { formF(p); });
}

//var imgCache = {};
function maybeCachedImage(p, f) {
    /*if (imgCache[f.name] && (imgCache[f.name].lastModified === f.file.lastModified)
        && (imgCache[f.name].pInstance === p)) {
        console.log('from cache', f.name);
        return imgCache[f.name].image;
    } else {
        var image = p.createImg(f.data).hide();
        imgCache[f.name] = {
            image: image,
            lastModified: f.file.lastModified,
            pInstance: p
        };
        return image;
    }*/
    return p.createImg(f.data);
}

/* function collectPoints(image) {
    var imgWidth = image.width,
        imgHeight = image.height;
    for (int x = 0; x < imgWidth; x += step) {

        for (int y = 0; y < imgHeight; y += step) {


            int brightness = (int) brightness(img.get(x, y));


            if (lastPoint < num && brightness > 3 && random(0, brightness) < 70) {

                float xpos = ((x / (float) imgWidth) * width) + (random(-step / 2, step / 2) * inregularity);
                float ypos = ((y / (float) imgHeight) * height) + (random(-step / 2, step / 2) * inregularity);

                points.add(new float[] {xpos, ypos, brightness});

                lastPoint += 1;
            }
        }
    }
}; */

function collectVoronoi(vertices) {

}

function Form(transform, style, apply) {
    this.transform = transform;
    this.style = style;
    this.apply = apply;
}

function ellipse(form, transform, style) {
    return new Form(function(p) {
        applyStyle(p. style);
        applyTransform(p. style);
        p.ellipse(transform.x, transform.y/*, */);
    });
}
