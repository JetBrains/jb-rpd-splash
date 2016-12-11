function initP5(w, h) {
    return function(p) {
        p.setup = function() {
            var c = p.createCanvas(w, h);
            c.addClass('p5-canvas');
            p.noLoop();
        };
        p.draw = function() {
            p.clear();
            p.background(0, 0);
            //drawForms(p, getForms() || []);
        };
    }
}

function maybeCachedImage(p, f) {
    return p.createImg(f.data);
}
