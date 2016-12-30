var SVG_XMLNS = "http://www.w3.org/2000/svg";

Rpd.noderenderer('jb/preview', 'svg', function() {
    //var myP5;
    return {
        size: { width: 30, height: 30 },
        pivot: { x: 0, y: 0 },
        first: function(bodyElm) {
            /* var targetDiv = document.getElementById('rpd-jb-preview-target');
            if (!targetDiv) {
                targetDiv = document.createElement('div');
                targetDiv.id = 'rpd-jb-preview-target';
                document.body.insertBefore(targetDiv, document.body.childNodes[0]);
            }
            targetDiv.style.pointerEvents = 'none';
            myP5 = new p5(initP5(window.innerWidth, window.innerHeight), targetDiv.id); */
        },
        always: function(bodyElm, inlets) {
            //lastForms = inlets.forms;
            //if (lastForms && lastForms.length)
            //myP5.redraw();
        }
    };
});

Rpd.noderenderer('jb/save', 'svg', {
    size: { width: 40, height: 40 },
    first: function(bodyElm) {
        var hiddenLink = d3.select(document.createElement('a'))
                           .attr('download', 'jb-sketch.png');

        var saveButton =
            d3.select(bodyElm).append('text')
                              .style('font-size', '24px')
                              .style('text-anchor', 'middle')
                              .text('💾');
        Kefir.fromEvents(saveButton.node(), 'mousemove').onValue(function() {
            saveButton.style('font-size', '27px');
        });
        Kefir.fromEvents(saveButton.node(), 'mouseout').onValue(function() {
            saveButton.style('font-size', '24px');
        });
        Kefir.fromEvents(saveButton.node(), 'click').onValue(function() {
            var canvasContainer = document.getElementById('rpd-jb-preview-target');
            if (!canvasContainer) return;
            var canvas = canvasContainer.children[0];
            if (!canvas) return;
            //hiddenLink.attr('href', canvas.toDataURL('image/png'));
            var blob = canvas.toBlob(function(blob) {
                var url = URL.createObjectURL(blob);

                hiddenLink.attr('href', url);
                hiddenLink.node().click();
                //URL.revokeObjectURL(url);
            });
        });
    }
});

/* Rpd.noderenderer('jb/image', 'svg', function() {
    var myP5, lastFile;
    function getLastFile() { return lastFile; }
    return {
        size: { width: 200, height: 50 },
        pivot: { x: 0, y: 0 },
        first: function(bodyElm) {
            var wrapperId = 'p5-canvas-' + lastCvsId;
            var wrapper = createCanvasWrapper(wrapperId, bodyElm);
            var node = this;
            myP5 = new p5(createP5ForImageDrop(node, 'file', getLastFile), wrapper);
            myP5.redraw();
            lastCvsId++;
        },
        always: function(bodyElm, inlets) {
            if (inlets.file) {
                lastFile = inlets.file;
                myP5.redraw();
            }
        }
    };
}); */

/* function createCanvasWrapper(wrapperId, bodyElm) {
    var group = document.createElementNS(SVG_XMLNS, 'g');
    group.setAttributeNS(null, 'transform', 'translate(10, 10)');
    var foreign = document.createElementNS(SVG_XMLNS, 'foreignObject');
    var wrapper = document.createElementNS(HTML_XMLNS, 'div');
    wrapper.id = wrapperId;
    wrapper.className = 'p5-canvas-wrapper';
    foreign.appendChild(wrapper);
    group.appendChild(foreign);
    bodyElm.appendChild(group);
    return wrapper;
} */

/* function createP5ForImageDrop(node, inletName, getFile) {
    return function(p) {
        p.setup = function() { var c = p.createCanvas(180, 30);
                               c.addClass('p5-canvas');
                               c.drop(function(file) {
                                   if (file.type === 'image') {
                                       node.inlets[inletName].receive(file);
                                   }
                               });
                               p.background(100);
                               p.noLoop(); };
        p.draw = function() {
            var file = getFile();
            if (file) {
                p.background(255);
                var image = maybeCachedImage(p, file);
                p.image(image.hide(), 0, 0, 30, 30);
            }
            p.noStroke();
            p.textSize(10);
            if (!file) {
                p.textAlign(p.CENTER);
                p.fill(255);
                p.text('Drag an image file onto this area.', p.width / 2, p.height / 2);
            } else {
                p.textAlign(p.LEFT);
                p.fill(100);
                p.text(file.name, 30, 18);
            }
        };
    }
} */

var PALETTE_NODE_WIDTH = 365;
var PALETTE_NODE_HEIGHT = 60;

var PALETTE_NODE_BODY_X = -(PALETTE_NODE_WIDTH / 2) + 10;
var PALETTE_NODE_BODY_Y = 0;
Rpd.noderenderer('jb/palette', 'svg', function() {
    var cellSide = 12;
    return {
        size: { width: PALETTE_NODE_WIDTH, height: PALETTE_NODE_HEIGHT },
        first: function(bodyElm) {
            var paletteChange = Kefir.emitter();
            var productChange = Kefir.emitter();
            var lastSelected, paletteGroups = [];
            d3.select(bodyElm)
                .append('g').attr('transform', 'translate(' + PALETTE_NODE_BODY_X + ', ' + PALETTE_NODE_BODY_Y + ')')
                .call(function(target) {
                PRODUCTS.forEach(function(product, i) {
                    var palette = product.palette;
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
            return { 'palette': { valueOut: paletteChange },
                     'product':  { valueOut: productChange } };
        }
    };
});

function prepareCanvas(myP5Canvas) {
    myP5Canvas.className = 'p5-canvas';
}
