function initP5(formsRef) {
    return function(p) {
        p.setup = function() {
            p.createCanvas(180, 180);
            p.noLoop();
        };
        p.draw = function() {
            p.background(p.color(255,255,255));
            drawForms(p, formsRef.forms);
        };
    }
}

function drawForms(p, forms) {
    forms.forEach(function(formF) { formF(p); });
}

var imgCache = {};
function maybeCachedImage(p, f) {
    if (imgCache[f.name] && (imgCache[f.name].lastModified === f.file.lastModified)
        && (imgCache[f.name].pInstance === p)) {
        return imgCache[f.name].image;
    } else {
        var image = p.createImg(f.data).hide();
        imgCache[f.name] = {
            image: image,
            lastModified: f.file.lastModified,
            pInstance: p
        };
        return image;
    }
}
