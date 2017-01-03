Rpd.channeltype('jb/config', {
    show: function(cfg) { return cfg ? '[Config]' : '[No Config]'; }
});

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

Rpd.channeltype('jb/product', { });

var PIXELS_COUNT_FACTOR = 4; // one pixel is four elements in the array
Rpd.channeltype('jb/pixels', {
    show: function(value) {
        if (!value) return '<None>';
        return value.width + 'x' + value.height + ', ' +
            ((value.pixels && value.pixels.length)
             ? (Math.floor(value.pixels.length / PIXELS_COUNT_FACTOR / 100) / 10) + 'kpx'
             : '0px');
    }
});

Rpd.nodetype('jb/config', {
    inlets: {
        'bang': { type: 'util/bang' },
        'srcPixels': { type: 'jb/pixels', default: null },
        'width': { type: 'jb/integer', 'default': window.innerWidth },
        'height': { type: 'jb/integer', 'default': window.innerHeight },
        'maxPoints': { type: 'jb/integer', 'default': window.innerWidth*window.innerHeight, name: 'max' },
        'scale': { type: 'util/number', 'default': 1 },
        'bgcolor': { type: 'util/color', 'default': _rgb(24, 24, 24) },
        'palette': { type: 'jb/palette' },
        'product': { type: 'jb/product' },
        'maxSquareSize': { type: 'jb/integer', 'default': 15, name: 'squareSize' },
        'density': { type: 'util/number', 'default': 6 },
        'inregularity': { type: 'util/number', 'default': 0.5 },
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

Rpd.nodetype('jb/palette', {
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

    var refreshSketch;

    var values = Kefir.emitter();

    var noiseSketch = function(p) {
        var width = window.innerHeight;
        var height = window.innerWidth;

        p.setup = function() {
            p.createCanvas(width, height);
            p.noLoop();
        };

        refreshSketch = function() {
            console.log('refresh called');
            p.redraw();
        };

        p.draw = function() {
            for (var x = 0; x <= width/2+10; x+=10) {
                for (var y = 0; y < height; y+=10) {
                    var c = 255 * p.noise(0.005 * x, 0.005 * y);
                    p.fill(c);
                    p.rect(x, y, 10, 10);
                    p.rect(width - x, y, 10, 10)
                }
            }
            p.loadPixels();
            console.log('emitting pixels');
            values.emit({
                width: width,
                height: height,
                pixels: p.pixels
            });
        };
    };

    var noiseP5 = new p5(noiseSketch);

    console.log(noiseP5);

    return {
        inlets: { 'bang': { type: 'util/bang' } },
        outlets: { 'pixels': { type: 'jb/pixels' } },
        process: function(inlets) {
            console.log('process called', 'refresh sketch is ', refreshSketch ? 'defined' : 'not defined');
            if (refreshSketch) refreshSketch();
            return {
                pixels: values
            }
        }
    };
});
