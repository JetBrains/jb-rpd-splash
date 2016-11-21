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
