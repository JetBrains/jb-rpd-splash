Rpd.channeltype('jb/forms', {
    show: function(forms) { return forms.length ? (forms.length + ' Forms') : 'No Forms'; }
});

Rpd.channeltype('jb/pixels', {
    show: function(pixels) { return pixels.width + 'x' + pixels.height + ' : ' + pixels.values.length; }
});

Rpd.nodetype('jb/render', {
    inlets: {
        //clear: { type: 'jb/any' },
        forms: { type: 'jb/forms', 'default': [] }
    },
    process: function() {}
});

Rpd.nodetype('jb/preview', {
    inlets: {
        //clear: { type: 'jb/any' },
        forms: { type: 'jb/forms', 'default': [] }
    },
    process: function() {}
});

var LAYERS_INLETS_COUNT = 5;
var layersInlets = {};
for (var i = 0; i < LAYERS_INLETS_COUNT; i++) {
    layersInlets['L' + i] = { type: 'jb/forms', 'default': [] };
}
Rpd.nodetype('jb/layers', {
    inlets: layersInlets,
    outlets: {
        'forms': { 'type': 'jb/forms' }
    },
    process: function(inlets) {
        var layers = [];
        for (var i = 0; i < LAYERS_INLETS_COUNT; i++) {
            layers = layers.concat(inlets['L' + i]);
        }
        return { 'forms': layers };
    }
});

Rpd.nodetype('jb/transform', {
    inlets: {
        'forms': { type: 'jb/forms', default: [] },
        'x': { type: 'util/number', default: 0 },
        'y': { type: 'util/number', default: 0 },
        'sx': { type: 'util/number', default: 1 },
        'sy': { type: 'util/number', default: 1 },
        'α': { type: 'util/number', default: 0 }
    },
    outlets: {
        'forms': { type: 'jb/forms' }
    },
    process: function(inlets) {
        /* return {
            forms: inlets.forms.map(function(formF) {
                return function(p) {
                    p.push();
                    p.rotate(inlets['α']);
                    p.scale(inlets.sx, inlets.sy);
                    p.translate(inlets.x, inlets.y);
                    formF(p);
                    p.pop();
                }
            })
        } */
        var forms = inlets.forms;
        return {
            forms: forms.length
                ? [
                    function(p) {
                        p.push();
                        p.rotate(inlets['α']);
                        p.scale(inlets.sx, inlets.sy);
                        p.translate(inlets.x, inlets.y);
                        forms.forEach(function(form) { form(p); });
                        p.pop();
                    }
                ] : []
        }
    }
});

Rpd.nodetype('jb/style', {
    inlets: {
        'forms': { type: 'jb/forms', 'default': [] },
        'fill': { type: 'util/color' },
        'stroke': { type: 'util/color' },
        'strokeWeight': { type: 'util/number', 'default': 1 }
    },
    outlets: {
        'forms': { type: 'jb/forms' }
    },
    process: function(inlets) {
        var fill = inlets['fill'];
        var stroke = inlets['stroke'];
        var strokeWeight = inlets.hasOwnProperty('strokeWeight') ? inlets['strokeWeight'] : 1;
        /* return {
            forms: inlets.forms.map(function(formF) {
                return function(p) {
                    p.push();
                    if (fill) p.fill(fill.r, fill.g, fill.b);
                    if (stroke) p.stroke(stroke.r, stroke.g, stroke.b);
                    p.strokeWeight(strokeWeight);
                    formF(p);
                    p.pop();
                }
            })
        } */
        var forms = inlets.forms;
        return {
            forms: forms.length
                ? [
                    function(p) {
                        p.push();
                        if (inlets['fill']) p.fill(inlets['fill']);
                        if (inlets['stroke']) p.stroke(inlets['stroke']);
                        if (inlets.hasOwnProperty('strokeWidth')) p.strokeWidth(inlets['strokeWidth']);
                        forms.forEach(function(form) { form(p); });
                        p.pop();
                    }
                ] : []
        }
    }
});

Rpd.nodetype('jb/ellipse', {
    inlets: {
        'bang': { 'type': 'util/bang' }
    },
    outlets: {
        'forms': { type: 'jb/forms' }
    },
    process: function() {
        return {
            'forms': [ function(p) {
                p.ellipse(5, 5, 10, 10);
            } ]
        }
    }
});

Rpd.nodetype('jb/image', {
    inlets: {
        'file': { 'type': 'core/any', hidden: true },
        'load-pixels': { 'type': 'core/boolean', 'default': false }
    },
    outlets: {
        'forms': { type: 'jb/forms' },
        'file': { type: 'core/any' },
        'pixels': { 'type': 'jb/pixels' }
    },
    process: function(inlets) {
        var file = inlets.file;
        var loadPixels = inlets['load-pixels'] || false;
        var node = this;
        return {
            forms: file
                ? [ function(p) {
                    p.image(maybeCachedImage(p, file).hide(), 0, 0, 300, 300);
                    if (loadPixels) {
                        p.loadImage(file.data, function(image) {
                            image.loadPixels();
                            var pixels = image.pixels;
                            var width = image.width;
                            var height = image.height;

                            node.outlets['pixels'].send({
                                width: width,
                                height: height,
                                values: pixels
                            });
                        });
                    }
                } ]
                : [],
            file: file
        }
    }
});

Rpd.nodetype('jb/perlin', {
    inlets: {
        forms: { type: 'jb/forms', 'default': [] },
        width: { type: 'util/number', 'default': 500 },
        height: { type: 'util/number', 'default': 500 },
        step: { type: 'util/number', 'default': 0.1 }
    },
    outlets: {
        forms: { type: 'jb/forms' }
    },
    process: function(inlets) {
        var forms = inlets.forms,
            width = inlets.width,
            height = inlets.height
            step = inlets.step;
        if ((step <= 0) || (step > 1)) {
            return { forms: [] };
        }
        return {
            forms: forms.length
                ? [
                    function(p) {
                        p.push();
                        var lastPos = [ 0, 0 ], nextPos, noiseVal, nx, ny;
                        forms.forEach(function(form) {
                            for (var x = 0; x <= 1; x += step) {
                                for (var y = 0; y <= 1; y += step) {
                                    var nx = p.noise(x);
                                    var ny = p.noise(y);
                                    //noiseVal = p.noise(x, y);
                                    //if (noiseVal > 0.5) {
                                        nx = x, ny = y;
                                        nextPos = [ nx * width,
                                                    ny * height ];
                                        // console.log('---');
                                        // console.log('x', x, 'y', y);
                                        // console.log('nx', nx, 'ny', ny);
                                        // console.log('lastPos', lastPos[0], lastPos[1]);
                                        // console.log('nextPos', nextPos[0], nextPos[1]);
                                        // console.log('translate to', nextPos[0] - lastPos[0], nextPos[1] - lastPos[1]);
                                        p.translate(nextPos[0] - lastPos[0], nextPos[1] - lastPos[1]);
                                        form(p);
                                        lastPos = nextPos;
                                    //}
                                }
                            }
                        });
                        p.pop();
                    }
                ] : []
        }
    }
});

Rpd.nodetype('jb/voronoi', {}); // -> edges

Rpd.nodetype('jb/delanay', {}); // -> edges
