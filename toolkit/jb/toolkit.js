Rpd.channeltype('jb/config', {
    show: function(cfg) { return cfg ? '[Config]' : '[No Config]'; }
});

Rpd.channeltype('jb/image', {
    show: function(img) { return img ? '[Image]' : '[No Image]'; }
});

Rpd.nodetype('jb/config', {
    inlets: {
        'width': { type: 'util/number', 'default': window.innerWidth },
        'height': { type: 'util/number', 'default': window.innerHeight },
        'maxPoints': { type: 'util/number', 'default': 5000, name: 'max' },
        'scale': { type: 'util/number', 'default': 1 },
        'maxSquareSize': { type: 'util/number', 'default': 3, name: 'squareSize' },
        'density': { type: 'util/number', 'default': 6 },
        'inregularity': { type: 'util/number', 'default': 0.7 }
    },
    outlets: {
        'config': { type: 'jb/config' }
    },
    process: function(inlets) {
        return {
            config: inlets
        };
    }
});

Rpd.nodetype('jb/preview', {
    inlets: {
        config: { type: 'jb/config', 'default': {} }
    },
    outlets: {
        image: { type: 'jb/image', 'default': null }
    },
    process: function(inlets) {
        window.updateSketchConfig(inlets.config);
        return { image: {} };
    }
});

// FIXME: setting type to 'core/bool' causes "cannot set '.hidden' to undefined"
// FIXME: Error: outlet/error — Outlet of type 'util/bang' is not allowed to connect to inlet of type 'jb/boolean'
/* Rpd.nodetype('jb/image', {
    inlets: {
        file: { type: 'core/any', hidden: true },
    },
    outlets: {
        forms: { type: 'jb/forms' }
    },
    process: function(inlets) {
        var file = inlets.file;
        return {
            forms: file
                ? [ function(p) {
                    //p.image(maybeCachedImage(p, file).hide(), 0, 0, 300, 300);
                } ]
                : []
        }
    }
});
 */

 Rpd.nodetype('jb/save', {
    inlets: { 'image': { type: 'jb/image' } },
    process: function() {}
});
