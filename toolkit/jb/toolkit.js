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
        'layers': { 'type': 'jb/forms' }
    },
    process: function(inlets) {
        var layers = [];
        for (var i = 0; i < LAYERS_INLETS_COUNT; i++) {
            layers = layers.concat(inlets['L' + i]);
        }
        return { 'layers': layers };
    }
});

Rpd.nodetype('jb/ellipse', {
    inlets: {
        'bang': { 'type': 'core/any' }
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
