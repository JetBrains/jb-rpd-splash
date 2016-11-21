Rpd.channeltype('jb/forms', {
    show: function(forms) { return forms.length ? (forms.length + ' Forms') : 'No Forms'; }
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
        return {
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
        }
        /* var forms = inlets.forms;
        return {
            forms: forms.length
                ? [
                    function(p) {
                        p.push();
                        p.rotate(inlets['α']);
                        p.scale(inlets.sx, inlets.sy);
                        p.translate(inlets.x, inlets.y);
                        forms.map(function(f) { return f(p); });
                        p.pop();
                    }
                ] : []
        } */
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
        return {
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
        }
        /* var forms = inlets.forms;
        return {
            forms: forms.length
                ? [
                    function(p) {
                        p.push();
                        if (inlets['fill']) p.fill(inlets['fill']);
                        if (inlets['stroke']) p.stroke(inlets['stroke']);
                        if (inlets.hasOwnProperty('strokeWidth')) p.strokeWidth(inlets['strokeWidth']);
                        p.pop();
                    }
                ] : []
        } */
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
                p.ellipse(50, 50, 80, 80);
            } ]
        }
    }
});

Rpd.nodetype('jb/image', {
    inlets: {
        'file': { 'type': 'core/any', hidden: true }
    },
    outlets: {
        'forms': { type: 'jb/forms' }
    },
    process: function(inlets) {
        var file = inlets.file;
        return {
            'forms': file
                ? [ function(p) {
                    p.image(maybeCachedImage(p, file), 0, 0, 300, 300);
                } ]
                : []
        }
    }
});
