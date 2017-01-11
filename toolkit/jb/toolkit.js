/* Rpd.channeltype('jb/config', {
    show: function(cfg) { return cfg ? '[Config]' : '[No Config]'; }
}); */

Rpd.channeltype('jb/darkmatter', { show: function(v) { return (v == 'dark') ? 'Dark Matter' : 'Light Matter' } });

Rpd.channeltype('jb/image', {
    show: function(img) { return img ? '[Image]' : '[No Image]'; }
});

Rpd.channeltype('jb/integer', {
    allow: [ 'util/number' ],
    default: 0,
    readonly: true,
    accept: function(val) {
        if (val === Infinity) return true;
        var parsed = parseFloat(val);
        return !isNaN(parsed) && isFinite(parsed);
    },
    adapt: function(val) { return Math.floor(parseFloat(val)); }
});

Rpd.channeltype('jb/palette', { show: howMuch('color', 'colors') });
Rpd.channeltype('jb/logo', { show: function(logo) { return logo.product + ', ' + logo.x + ', '+ logo.y; } });

Rpd.channeltype('jb/product', { });

Rpd.channeltype('jb/drawable', {
    allow: [ 'jb/darkmatter' ],
    show: function(v) { return (v && v !== 'dark') ? '<Drawable>' : '<Empty>'; }
});

Rpd.channeltype('jb/voronoi', { show: function(v) { return v ? '<Voronoi>' : '<Empty>'; } });

Rpd.channeltype('jb/point-data', { show: howMuch('point', 'points') });

Rpd.channeltype('jb/layers', { show: howMuch('layer', 'layers') });

var PIXELS_COUNT_FACTOR = 4; // one pixel is four elements in the array
Rpd.channeltype('jb/pixels', {
    show: function(pixels) {
        if (!pixels) return '<None>';
        return pixels.width + 'x' + pixels.height + ', ' +
            ((pixels.values && pixels.values.length)
             ? (Math.floor(pixels.values.length / PIXELS_COUNT_FACTOR / 100) / 10) + 'kpx'
             : '0px');
    }
});

/* Rpd.nodetype('jb/config', {
    inlets: {

        'width': { type: 'jb/integer', 'default': window.innerWidth },
        'height': { type: 'jb/integer', 'default': window.innerHeight },
        'srcPixels': { type: 'jb/pixels', 'default': null },
        'bgcolor': { type: 'util/color', 'default': _rgb(24, 24, 24) },
        'palette': { type: 'jb/palette' },
        'logo': { type: 'jb/logo' },
        'maxSquareSize': { type: 'jb/integer', 'default': 15, name: 'squareSize' },
        'chaos': { type: 'util/number', 'default': 0.5 },
        'tmp' : {type: 'util/number'},
        'step': { type: 'jb/integer', 'default': 16 }
    },
    outlets: {
        'config': { type: 'jb/config' }
    },
    process: function(inlets) {
        return {
            config: inlets
        };
    }
}); */

Rpd.nodetype('jb/clear', {
    // title: 'Dark Matter',
    title: 'Clear',
    inlets: {
        trigger: { type: 'jb/darkmatter', default: 'dark', hidden: true }
    },
    outlets: {
        clear: { type: 'jb/darkmatter' }
    },
    process: function() {
        return { 'clear': 'dark' };
    }
});

Rpd.nodetype('jb/preview', {
    title: 'Preview',
    inlets: {
        layers: { type: 'jb/layers', 'default': [] }
    },
    outlets: {
        image: { type: 'jb/image', 'default': null }
    },
    process: function(inlets) {
        var config = {};
        config.layers = inlets.layers;
        window.updateSketchConfig(config);
        return { image: {} };
    }
});


Rpd.nodetype('jb/rorschach', {
    title: 'Rorschach',
    inlets: {
        'pixels': { type: 'jb/pixels' }
    },
    outlets: {
        'pixels': { type: 'jb/pixels' }
    },
    process: function(inlets) {
        if (!inlets.pixels) return; // FIXME: why this condition needed?
        var pixels = inlets.pixels;
        var d = pixels.density;
        var width =  pixels.width;
        var height = pixels.height;
        var source = pixels.values;
        var target = [];

        var trgIdx, srcIdx;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                for (var i = 0; i < d; i++) {
                    for (var j = 0; j < d; j++) {
                        trgIdx = 4 * ((y * d + j) * width * d + (x * d + i));
                        srcIdx = (x < width / 2) ? trgIdx : 4 * ((y * d + j) * width * d + ((width - x) * d + i));
                        target[trgIdx] = source[srcIdx];
                        target[trgIdx+1] = source[srcIdx+1];
                        target[trgIdx+2] = source[srcIdx+2];
                        target[trgIdx+3] = source[srcIdx+3];
                    }
                }
            }
        }

        pixels.values = target;
        return { 'pixels': pixels };
    }


});

// FIXME: make an option for rorshach node
Rpd.nodetype('jb/rorschach-vertical', {
    title: 'V-Rorschach',
    inlets: {
        'pixels': { type: 'jb/pixels' }
    },
    outlets: {
        'pixels': { type: 'jb/pixels' }
    },
    process: function(inlets) {
        if (!inlets.pixels) return; // FIXME: why this condition needed?
        var pixels = inlets.pixels;
        var d = pixels.density;
        var width = pixels.width;
        var height = pixels.height;
        var source = pixels.values;
        var target = [];


        var trgIdx, srcIdx;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                for (var i = 0; i < d; i++) {
                    for (var j = 0; j < d; j++) {
                        trgIdx = 4 * ((y * d + j) * width * d + (x * d + i));
                        srcIdx = (y < height / 2) ? trgIdx : 4 * (((height - y) * d + j) * width * d + ((x * d + i)));
                        target[trgIdx] = source[srcIdx];
                        target[trgIdx+1] = source[srcIdx+1];
                        target[trgIdx+2] = source[srcIdx+2];
                        target[trgIdx+3] = source[srcIdx+3];
                    }
                }
            }
        }

        //console.log(target)

        pixels.values = target;
        return { 'pixels': pixels };
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
    title: 'Save Image',
    inlets: { 'image': { type: 'jb/image' } },
    process: function() {}
});

Rpd.nodetype('jb/palette', {
    title: 'Palette',
    inlets: {
        'palette': { type: 'jb/palette', default: PRODUCTS[0].palette, label: 'selection', hidden: true },
        'product': { type: 'jb/product', default: PRODUCTS[0].id, label: 'product', hidden: true },
    },
    outlets: {
        'palette': { type: 'jb/palette' },
        'product': { type: 'jb/product' }
    },
    process: function(inlets) {
        return {
            palette: inlets.palette,
            product: inlets.product
        };
    }
});

Rpd.nodetype('jb/noise', function() {

    var refreshSketch = initNoiseSketch();

    return {
        title: 'Noise',
        inlets: {
            'bang': { type: 'util/bang' },
            'octave': { type: 'util/wholenumber', 'default': 4 },
            'falloff': { type: 'util/number', 'default': 0.5 },
            'step': { type: 'util/wholenumber', 'default': 10 }
        },
        outlets: { 'pixels': { type: 'jb/pixels' } },
        process: function(inlets) {
            return {
                pixels: refreshSketch(inlets)
            }
        }
    };
});

Rpd.nodetype('jb/layers', {
    title: 'Layers',
    inlets: {
        'layer-1': { type: 'jb/drawable' },
        'layer-2': { type: 'jb/drawable' },
        'layer-3': { type: 'jb/drawable' },
        'layer-4': { type: 'jb/drawable' },
        'layer-5': { type: 'jb/drawable' },
        'layer-6': { type: 'jb/drawable' },
        'layer-7': { type: 'jb/drawable' },
        'layer-8': { type: 'jb/drawable' }
    },
    outlets: {
        'layers': { type: 'jb/layers' }
    },
    process: function(inlets) {
        var layers = [];
        //var layersCount = Object.keys(inlets).length;
        for (var i = 0; i < 8; i++) {
            layers.push(inlets['layer-' + (i + 1)]);
        }
        return {
            'layers': layers
        }
    }
});

Rpd.nodetype('jb/draw-pixels', {
    title: 'Draw Pixels',
    inlets: {
        'pixels': { type: 'jb/pixels' },
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        return {
            'drawable': {
                'conf': inlets.pixels,
                'func': drawPixels
            }
        }
    }
});

Rpd.nodetype('jb/collect-point-data', {
    title: 'Collect Points',
    inlets: {
        'chaos': { type: 'util/number', default: 0.5 },
        'step': { type: 'util/number', default: 16 },
        'pixels': { type: 'jb/pixels' }
    },
    outlets: {
        'points': { type: 'jb/point-data' }
    },
    process: function(inlets) {
        if (!inlets.pixels) return;
        return {
            'points': collectPointData(inlets.pixels, inlets)
        }
    }
});

Rpd.nodetype('jb/apply-gradient', {
    title: 'Make Gradient',
    inlets: {
        'width': { type: 'util/number', default: window.innerWidth },
        'height': { type: 'util/number', default: window.innerHeight },
        'palette': { type: 'jb/palette' }
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        return {
            'drawable': {
                'conf': inlets,
                'func': applyGradient
            }
        }
    }
});

Rpd.nodetype('jb/vignette', {
    title: 'Vignette',
    inlets: {
        'width': { type: 'util/number', default: window.innerWidth },
        'height': { type: 'util/number', default: window.innerHeight },
        'palette': { type: 'jb/palette' }
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        return {
            'drawable': {
                'conf': inlets,
                'func': drawDarkGradients
            }
        }
    }
});

Rpd.nodetype('jb/voronoi', {
    title: 'Voronoi',
    inlets: {
        'width': { type: 'util/number', default: window.innerWidth },
        'height': { type: 'util/number', default: window.innerHeight },
        'points': { type: 'jb/point-data' }
    },
    outlets: {
        'voronoi': { type: 'jb/voronoi' }
    },
    process: function(inlets) {
        if (!inlets.points || !inlets.width || !inlets.height) return;
        return {
            'voronoi': d3.voronoi().size([inlets.width, inlets.height])(inlets.points)
        }
    }
});

Rpd.nodetype('jb/curved-edges', {
    title: 'Curves',
    inlets: {
        'voronoi': { type: 'jb/voronoi' }
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        if (!inlets.voronoi) return;
        return {
            'drawable': {
                'conf': inlets.voronoi,
                'func': drawCurvedEdges
            }
        }
    }
});

Rpd.nodetype('jb/shapes', {
    title: 'Shapes',
    inlets: {
        'voronoi': { type: 'jb/voronoi' }
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        if (!inlets.voronoi) return;
        return {
            'drawable': {
                'conf': inlets.voronoi,
                'func': drawShapes
            }
        }
    }
});

Rpd.nodetype('jb/edges-squares', {
    title: 'Edges & Squares',
    inlets: {
        'voronoi': { type: 'jb/voronoi' },
        'pixels': { type: 'jb/pixels' },
        'palette': { type: 'jb/palette' },
        'maxSquareSize': { type: 'util/number', default: 15 }
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        if (!inlets.pixels || !inlets.voronoi || !inlets.palette) return;
        return {
            'drawable': {
                'conf': inlets,
                'func': drawEdgesSquares
            }
        }
    }
});

Rpd.nodetype('jb/back-edges-squares', {
    title: 'Back Edges & Squares',
    inlets: {
        'points': { type: 'jb/point-data' }
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        if (!inlets.points) return;
        return {
            'drawable': {
                'conf': inlets.points,
                'func': drawBackEdgesSquares
            }
        }
    }
});

Rpd.nodetype('jb/draw-logo', {
    title: 'Draw Logo',
    inlets: {
        product: { type: 'jb/product', 'default': '' },
        x: { type: 'util/number', 'default': 0.5 },
        y: { type: 'util/number', 'default': 0.5 }
    },
    outlets: {
        drawable: { type: 'jb/drawable' }
    },
    process: function(inlets) {
        return {
            'drawable': {
                'conf': inlets,
                'func': drawLogo
            }
        }
    }
});
