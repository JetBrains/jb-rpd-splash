function initP5(getForms, w, h) {
    return function(p) {
        p.setup = function() {
            var c = p.createCanvas(w, h);
            c.style("visibility", "visible"); // FIXME: why needed?
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
    return p.createImg(f.data).hide();
}
