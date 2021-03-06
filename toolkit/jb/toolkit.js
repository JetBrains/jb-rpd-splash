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

Rpd.channeltype('jb/noise-step', {
    allow: ['util/wholenumber'],
    adapt : function(val) { return val < 1 ? 1 : val; }
});


Rpd.channeltype('jb/brightness', {
    allow: ['util/wholenumber'],
    adapt : function(val) { return val > 255 ? 255 : val; }
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

Rpd.channeltype('jb/layers', {
    show: function(v) {
        return howMuch('layer', 'layers')(v.values);
    }
});

Rpd.channeltype('jb/angle', {
    allow: [ 'util/number' ],
    show: function(v) { return Math.floor(v * (180 / Math.PI)) + '°'; }
});

var PIXELS_COUNT_FACTOR = 4; // one pixel is four elements in the array
Rpd.channeltype('jb/pixels', {
    show: function(pixels) {
        if (!pixels) return '<None>';
        return pixels.values && pixels.values.length
             ? (Math.floor(pixels.values.length / PIXELS_COUNT_FACTOR / 100) / 10) + 'kpx'
             : '0px';
        /* return pixels.width + 'x' + pixels.height + ', ' +
            ((pixels.values && pixels.values.length)
             ? (Math.floor(pixels.values.length / PIXELS_COUNT_FACTOR / 100) / 10) + 'kpx'
             : '0px'); */
    }
});

function adaptToOne(val) {
    if ( val < 0 ) {
        return 0;
    } else if (val > 1) {
        return 1;
    } else {
        return val;
    }
}

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


Rpd.nodetype('jb/rorschach', function() {

    var refreshSketch = initHRorschachSketch();

    return {
        title: 'H-Rorschach',
        inlets: {
            'pixels': { type: 'jb/pixels' }
        },
        outlets: {
            'pixels': { type: 'jb/pixels' }
        },
        process: function(inlets) {
            if (!inlets.pixels) return;

            return { 'pixels': refreshSketch(inlets) };
        }
    };
});

// FIXME: make an option for rorshach node
Rpd.nodetype('jb/rorschach-vertical', function() {

    var refreshSketch = initVRorschachSketch();

    return {
        title: 'V-Rorschach',
        inlets: {
            'pixels': { type: 'jb/pixels' }
        },
        outlets: {
            'pixels': { type: 'jb/pixels' }
        },
        process: function(inlets) {
            if (!inlets.pixels) return;

            return { 'pixels': refreshSketch(inlets) };
        }
    };
});

Rpd.nodetype('jb/image', function() {

    var refreshSketch = initCustomBackgroundSketch();

    return {
        inlets: {
            file: { type: 'core/any', hidden: true },
        },
        outlets: {
            pixels: { type: 'jb/pixels' }
        },
        process: function(inlets) {
            return { 'pixels': refreshSketch(inlets) };
        }
    };
});

 Rpd.nodetype('jb/save', {
    title: 'Save Image',
    inlets: { 'image': { type: 'jb/image' } },
    process: function() {}
});

Rpd.nodetype('jb/palette', {
    title: 'Product Palette',
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
            'grain': { type: 'jb/noise-step', 'default': 10 },
            'octave': { type: 'util/wholenumber', 'default': 4 },
            'falloff': { type: 'util/number', 'default': 0.9 },
            'palette': { type: 'jb/palette', default: [ '#ffffff', '#000000', '#000000']},
            'border': { type: 'util/number', 'default': 0 },
            'radius': { type: 'util/number', 'default': 0, 'adapt': adaptToOne }
        },
        outlets: { 'pixels': { type: 'jb/pixels' } },
        process: function(inlets) {
            return {
                pixels: refreshSketch(inlets)
            }
        }
    };
});

var MAX_LAYERS = 9;

var LAYERS_INLETS = {};
LAYERS_INLETS['background'] = { type: 'util/color', default: { r: 66, g: 66, b: 66 } };
for (var i = 0; i < MAX_LAYERS; i++) {
    LAYERS_INLETS['layer-' + (i + 1)] =  { type: 'jb/drawable' }
};

LAYERS_INLETS['renderOptions'] = { type: 'core/any', hidden: true };

var DEFAULT_LAYER_OPTIONS = {
    blendMode: '',
    opacity: 1
};

var lastLayersConfig;
Rpd.nodetype('jb/layers', {
    title: 'Layers',
    inlets: LAYERS_INLETS,
    outlets: {
        'layers': { type: 'jb/layers' }
    },
    process: function(inlets) {
        //if (!inlets.renderOptions) return;
        var renderOptions = inlets.renderOptions;
        var layers = [];
        var layer;
        for (var i = 0; i < MAX_LAYERS; i++) {
            layer = inlets['layer-' + (i + 1)];
            if (layer && layer != 'dark') {
                layers.push([ inlets['layer-' + (i + 1)],
                              renderOptions ? renderOptions[i] : DEFAULT_LAYER_OPTIONS ]);
            }
        }
        if (!layers.length) return;
        return {
            'layers': { background: inlets.background,
                        values: layers }
        }
    }
});

Rpd.nodetype('jb/draw-pixels', {
    title: 'Draw Pixels',
    inlets: {
        'pixels': { type: 'jb/pixels'},
        'blur': { type: 'util/number'},
        'contrast': { type: 'util/number'}
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        return {
            'drawable': {
                'conf': inlets,
                'func': drawPixels
            }
        }
    }
});

Rpd.nodetype('jb/collect-point-data', {
    title: 'Collect Points',
    inlets: {
        'chaos': { type: 'util/wholenumber', default: 50 },
        'step': { type: 'util/wholenumber', default: 16 },
        'low': { type: 'jb/brightness', default: 40 },
        'high': { type: 'jb/brightness', default: 30 },
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
        'width': { type: 'util/number', default: window.innerWidth, hidden: true },
        'height': { type: 'util/number', default: window.innerHeight, hidden: true },
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
        'width': { type: 'util/number', 'default': window.innerWidth, hidden: true },
        'height': { type: 'util/number', 'default': window.innerHeight, hidden: true },
        'iris': { type: 'util/number', 'default': 100 },
        'pupilOpacity': { type: 'util/number', 'default': 0 },
        'pupilColor': { type: 'util/color', 'default': _rgb(255, 255, 255) }
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
        'width': { type: 'util/number', default: window.innerWidth, hidden: true },
        'height': { type: 'util/number', default: window.innerHeight, hidden: true },
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
        'voronoi': { type: 'jb/voronoi' },
        'density': { type: 'util/number', default: 0.3 },
        'near': { type: 'util/number', default: 0.5 },
        'far': { type: 'util/number', default: 0.4 },
        'curve': { type: 'util/number', default: 0.5 },
        'palette': { type: 'jb/palette', default: [ '#ffffff', '#ffffff', '#ffffff']}
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        if (!inlets.voronoi) return;
        return {
            'drawable': {
                'conf': inlets,
                'func': drawCurvedEdges
            }
        }
    }
});

Rpd.nodetype('jb/shapes', {
    title: 'Shapes',
    inlets: {
        'voronoi': { type: 'jb/voronoi' },
        'qty': { type: 'util/number', default: 0.12 },
        'palette': { type: 'jb/palette', default: [ '#ffffff', '#ffffff', '#ffffff']}
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        if (!inlets.voronoi) return;
        return {
            'drawable': {
                'conf': inlets,
                'func': drawShapes
            }
        }
    }
});

Rpd.nodetype('jb/edges-joints', {
    title: 'Edges & Joints',
    inlets: {
        'voronoi': { type: 'jb/voronoi' },
        'pixels': { type: 'jb/pixels' },
        'palette': { type: 'jb/palette', 'default': [ '#ffffff', '#ffffff', '#ffffff']},
        'jointSize': { type: 'util/number', 'default': 10 },
        'jointBorder': { type: 'util/number', 'default': 0 },
        'jointRadius' : {type: 'util/number', 'default': 0, 'adapt': adaptToOne }
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        if (!inlets.pixels || !inlets.voronoi || !inlets.palette) return;
        return {
            'drawable': {
                'conf': inlets,
                'func': drawEdgesJoints
            }
        }
    }
});

Rpd.nodetype('jb/back-edges-squares', {
    title: 'Back Edges & Squares',
    inlets: {
        'points': { type: 'jb/point-data' },
        'range': { type: 'util/number', 'default': 50 },
        'palette': { type: 'jb/palette', default: [ '#ffffff', '#ffffff', '#ffffff']}
    },
    outlets: {
        'drawable': { type: 'jb/drawable' }
    },
    process: function(inlets) {
        if (!inlets.points) return;
        return {
            'drawable': {
                'conf': inlets,
                'func': drawBackEdgesSquares
            }
        }
    }
});

Rpd.nodetype('jb/draw-logo', {
    title: 'Draw Logo',
    inlets: {
        product: { type: 'jb/product' },
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

Rpd.nodetype('jb/background', function() {
    var refreshSketch = initBackgroundSketch();

    return {
        title: 'Background',
        inlets: {
            bang: { type: 'util/bang' },
            product: { type: 'jb/product' },
            width: { type: 'util/number', default: window.innerWidth, hidden: true },
            height: { type: 'util/number', default: window.innerHeight, hidden: true },
            angle: { type: 'jb/angle', default: 0 },
            scale: { type: 'util/number', default: 1 },
            x: { type: 'util/number', default: 0 },
            y: { type: 'util/number', default: 0 }
        },
        outlets: {
            pixels: { type: 'jb/pixels' }
        },
        process: function(inlets) {
            if (!inlets.bang || !inlets.product) return;
            return {
                pixels: refreshSketch(inlets)
            }
        }
    }
});

Rpd.nodetype('jb/switch', {
    inlets: {
        value: { type: 'util/wholenumber', hidden: true }
    },
    outlets: {
        'way-one': { type: 'util/bang' },
        'way-two': { type: 'util/bang' }
    },
    process: function(inlets) {
        if (inlets.value == 1) return { 'way-one': {} };
        if (inlets.value == 2) return { 'way-two': {} };
    }
});

Rpd.nodetype('jb/three-colors', {
    inlets: {
        'color-1': { type: 'util/color' },
        'color-2': { type: 'util/color' },
        'color-3': { type: 'util/color' }
    },
    outlets: {
        'palette': { type: 'jb/palette' }
    },
    process: function(inlets) {
        return {
            'palette':  [ inlets['color-1'] ? toHexColor(inlets['color-1']) : 'transparent',
                          inlets['color-2'] ? toHexColor(inlets['color-2']) : 'transparent',
                          inlets['color-3'] ? toHexColor(inlets['color-3']) : 'transparent' ]
        }
    }
});
