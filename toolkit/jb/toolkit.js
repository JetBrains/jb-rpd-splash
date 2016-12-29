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

Rpd.nodetype('jb/config', {
    inlets: {
        'width': { type: 'jb/integer', 'default': window.innerWidth },
        'height': { type: 'jb/integer', 'default': window.innerHeight },
        'maxPoints': { type: 'jb/integer', 'default': 5000, name: 'max' },
        'scale': { type: 'util/number', 'default': 1 },
        'bgcolor': { type: 'util/color', 'default': _rgb(24, 24, 24) },
        'palette': { type: 'jb/palette' },
        'maxSquareSize': { type: 'jb/integer', 'default': 3, name: 'squareSize' },
        'density': { type: 'util/number', 'default': 6 },
        'inregularity': { type: 'util/number', 'default': 0.7 },
        'step': { type: 'jb/integer', 'default': 12 }
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
        'selection': { type: 'jb/palette', default: PALETTES[0], label: 'selection', hidden: true }
    },
    outlets: {
        'palette': { type: 'jb/palette' }
    },
    process: function(inlets) { return { palette: inlets.selection }; }
});

Rpd.noderenderer('jb/palette', 'svg', function() {
    var cellSide = 12;
    return {
        size: { width: 365, height: 60 },
        first: function(bodyElm) {
            var paletteChange = Kefir.emitter();
            var lastSelected, paletteGroups = [];
            d3.select(bodyElm)
                .append('g').attr('transform', 'translate(5, 0)')
                .call(function(target) {
                PALETTES.forEach(function(palette, i) {
                    target.append('g')
                            .attr('class', 'rpd-jb-palette-variant')
                            .attr('transform', 'translate(' + (i * 14) + ', ' +
                                                            (-1 * (palette.length / 2 * cellSide)) + ')')
                            .call((function(palette) { return function(paletteGroup) {
                                palette.forEach(function(color, i) {
                                    paletteGroup.append('rect').attr('rx', 4)
                                                .attr('x', 0).attr('y', i * cellSide)
                                                .attr('width', cellSide).attr('height', cellSide)
                                                .attr('fill', color);
                                });
                                Kefir.fromEvents(paletteGroup.node(), 'click').onValue(function() {
                                    if (lastSelected) lastSelected.attr('class', 'rpd-jb-palette-variant')
                                    paletteGroup.attr('class', 'rpd-jb-palette-variant rpd-jb-active-variant');
                                    lastSelected = paletteGroup;
                                    paletteChange.emit(palette);
                                });
                                paletteGroups.push(paletteGroup);
                            } })(palette));
                });
            });
            lastSelected = paletteGroups[0];
            paletteGroups[0].attr('class', 'rpd-jb-palette-variant rpd-jb-active-variant');
            return { 'selection': { valueOut: paletteChange } };
        }
    };
});
