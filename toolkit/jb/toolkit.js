Rpd.nodetype('jb/config', {
    inlets: {
        //'shape': { type: 'p5/shape', default: 'circle', name: 'shape' },
        'wavescount': { type: 'util/number', default: 5, name: 'waves' },
        //'startcolor': { type: 'p5/color', name: 'from' },
        //'endcolor': { type: 'p5/color', name: 'to' },
        //'xspacing': { type: 'util/number', default: 16, name: 'xspan' },
        //'amplitude': { type: 'util/number', default: 75, name: 'ampl.' },
        //'period': { type: 'util/number', default: 500, name: 'period' }
    },
    outlets: {
        'config': { type: 'core/any' }
    },
    process: function(inlets) { }
});

Rpd.nodetype('jb/preview', {
    inlets: {
        config: { type: 'core/any', 'default': {} }
    },
    process: function(inlets) {
        window.sketchUpdate(inlets.config);
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
