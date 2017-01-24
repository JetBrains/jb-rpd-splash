var SVG_XMLNS = "http://www.w3.org/2000/svg";

Rpd.noderenderer('jb/preview', 'svg', function() {
    //var myP5;
    return {
        size: { width: 55, height: 30 },
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
    size: { width: 80, height: 40 },
    first: function(bodyElm) {
        var hiddenLink = d3.select(document.createElement('a'))
                           .attr('download', 'jetbrains-art.png');

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
            var canvas = d3.select('#rpd-jb-preview-target .sketch-canvas').node();
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

var PALETTE_NODE_WIDTH = PRODUCTS.length * 14 + 20;
var PALETTE_NODE_HEIGHT = 70;

var PALETTE_NODE_BODY_X = -(PALETTE_NODE_WIDTH / 2) + 10;
var PALETTE_NODE_BODY_Y = 5;
var LABEL_Y_SHIFT = 10;
Rpd.noderenderer('jb/palette', 'svg', function() {
    var cellSide = 12;
    return {
        size: { width: PALETTE_NODE_WIDTH, height: PALETTE_NODE_HEIGHT },
        first: function(bodyElm) {
            var paletteChange = Kefir.emitter();
            var productChange = Kefir.emitter();
            var lastSelected, lastHilitedLabel;
            var paletteGroups = [], labelText = {};
            d3.select(bodyElm)
                .append('g')
                .call(function(rootGroup) {
                    var labels = rootGroup.append('g')
                                          .attr('transform', 'translate(' + PALETTE_NODE_BODY_X +
                                                                     ', ' + ((-1 * PALETTE_NODE_HEIGHT / 2) + LABEL_Y_SHIFT) + ')');
                    PRODUCTS.forEach(function(product, i) {
                        labelText[product.id] =
                                    labels.append('text')
                                          .attr('class', 'rpd-jb-product-label')
                                          .attr('transform', 'translate(' + (i * 14) + ',  0)')
                                          .text(product.label);
                    });
                })
                .call(function(rootGroup) {
                    var palettes = rootGroup.append('g')
                                            .attr('transform', 'translate(' + PALETTE_NODE_BODY_X +
                                                                       ', ' + PALETTE_NODE_BODY_Y + ')');
                    PRODUCTS.forEach(function(product, i) {
                        var palette = product.palette;
                        palettes.append('g')
                                .attr('class', 'rpd-jb-palette-variant')
                                .attr('transform', 'translate(' + (i * 14) + ', ' +
                                                                (-1 * (palette.length / 2 * cellSide)) + ')')
                                .call((function(palette, productId) { return function(paletteGroup) {
                                    palette.forEach(function(color, i) {
                                        paletteGroup.append('rect').attr('rx', 4)
                                                    .attr('x', 0).attr('y', i * cellSide)
                                                    .attr('width', cellSide).attr('height', cellSide)
                                                    .attr('fill', color);
                                    });
                                    Kefir.fromEvents(paletteGroup.node(), 'click').onValue(function() {
                                        if (lastSelected) lastSelected.attr('class', 'rpd-jb-palette-variant');
                                        if (lastHilitedLabel) lastHilitedLabel.attr('class', 'rpd-jb-product-label');
                                        labelText[productId].attr('class', 'rpd-jb-product-label rpd-jb-active-label');
                                        paletteGroup.attr('class', 'rpd-jb-palette-variant rpd-jb-active-variant');
                                        lastSelected = paletteGroup;
                                        lastHilitedLabel = labelText[productId];
                                        paletteChange.emit(palette);
                                        productChange.emit(product.id);
                                    });
                                    paletteGroups.push(paletteGroup);
                                } })(palette, product.id));
                    });
                });

            lastSelected = paletteGroups[0];
            paletteGroups[0].attr('class', 'rpd-jb-palette-variant rpd-jb-active-variant');
            return { 'palette': { valueOut: paletteChange },
                     'product':  { valueOut: productChange } };
        }
    };
});

Rpd.noderenderer('jb/clear', 'svg', {
    size: { width: 30, height: 25 },
    first: function(bodyElm) {
        var circle = d3.select(svgNode('circle'))
                       .attr('r', 9).attr('fill', 'black')
                       .style('cursor', 'pointer')
                       .style('pointer-events', 'all');
        bodyElm.appendChild(circle.node());
        var circleClicks = Kefir.fromEvents(circle.node(), 'click');
        circleClicks.onValue(function() {
            circle.classed('rpd-util-bang-fresh', true);
        });
        circleClicks.delay(500).onValue(function() {
            circle.classed('rpd-util-bang-fresh', false);
        });
        return { 'trigger':
            { valueOut: circleClicks.map(function() { return {}; }) }
        };
    }
});

function svgNode(name) {
    return document.createElementNS(SVG_XMLNS, name);
}

function prepareCanvas(myP5Canvas) {
    myP5Canvas.className = 'p5-canvas';
}

// FIXME: almost the complete copy of util/knobs

var defaultKnobConf = {
    speed: 1.5,
    radius: 10,
    width: 30, // radius * 2 + margin
    height: 30,
    //showIntTicks: false,
    //stickToInts: false,
    showGhost: true,
    adaptAngle: null,
    adaptValue: null
};

function createKnob(state, conf) {
    var lastValue = 0;
    //var state = { min: 0, max: 100 };

    var adaptAngle = conf.adaptAngle || function(s, v) { return v * 360; };

    return {
        init: function(parent, valueIn) {
            var hand, handGhost, face, text;
            var submit = Kefir.emitter();
            d3.select(parent)
              .call(function(bodyGroup) {
                  face = bodyGroup.append('circle').attr('r', conf.radius)
                                  .style('fill', 'rgba(200, 200, 200, .2)')
                                  .style('stroke-width', 2)
                                  .style('stroke', '#000');
                  handGhost = bodyGroup.append('line')
                                  .style('visibility', 'hidden')
                                  .attr('x1', 0).attr('y1', 0)
                                  .attr('x2', 0).attr('y2', conf.radius - 1)
                                  .style('stroke-width', 2)
                                  .style('stroke', 'rgba(255,255,255,0.1)');
                  hand = bodyGroup.append('line')
                                  .attr('x1', 0).attr('y1', 0)
                                  .attr('x2', 0).attr('y2', conf.radius)
                                  .style('stroke-width', 2)
                                  .style('stroke', '#000');
                  text = bodyGroup.append('text')
                                  .style('text-anchor', 'middle')
                                  .style('fill', '#fff')
                                  .text(0);
              });
            Kefir.fromEvents(parent, 'mousedown')
                 .map(stopPropagation)
                 .flatMap(function() {
                     if (conf.showGhost) handGhost.style('visibility', 'visible');
                     var values =
                        Kefir.fromEvents(document.body, 'mousemove')
                             //.throttle(16)
                             .takeUntilBy(Kefir.fromEvents(document.body, 'mouseup'))
                             .map(stopPropagation)
                             .map(function(event) {
                                 var faceRect = face.node().getBoundingClientRect();
                                 return { x: event.clientX - (faceRect.left + conf.radius),
                                          y: event.clientY - (faceRect.top + conf.radius) };
                             })
                             .map(function(coords) {
                                 var value = ((coords.y * conf.speed * -1) + 180) / 360;
                                 if (value < 0) {
                                     value = 0;
                                 } else if (value > 1) {
                                     value = 1;
                                 }
                                 return value;
                            });
                     values.last().onValue(function(val) {
                         lastValue = val;
                         handGhost.attr('transform', 'rotate(' + adaptAngle(state, lastValue) + ')')
                                  .style('visibility', 'hidden');
                         submit.emit(lastValue);
                     });
                     return values;
                 })
                 .merge(valueIn || Kefir.never())
                 .onValue(function(value) {
                     var valueText = Math.floor(value * 100) / 100;
                     text.text(conf.adaptValue ? conf.adaptValue(valueText) : valueText);
                     hand.attr('transform', 'rotate(' + adaptAngle(state, value) + ')');
                 });
            return submit.merge(valueIn ? valueIn : Kefir.never());
        }
    }
}

function initKnobInGroup(knob, target, id, count, width, height, valueIn) {
    var submit;
    d3.select(target).append('g')
      .attr('transform', 'translate(0,' + ((id * height) + (height / 2) - (count * height / 2)) + ')')
      .call(function(knobRoot) {
          knob.root = knobRoot;
          submit = knob.init(knobRoot.node(), valueIn);
      });
    return submit;
}

var LETTER_WIDTH = 15;
var BLENDS = [
    //{ label: '•', name: 'NORMAL', value: 'N' },
    { label: '•', name: 'BLEND', value: 'B' },
    //{ label: '•', name: 'ADD', value: 'A' },
    //{ label: '•', name: 'DARKEST', value: 'K' },
    //{ label: '•', name: 'LIGHTEST', value: 'L' },
    { label: '•', name: 'DIFFERENCE', value: 'D' },
    //{ label: '•', name: 'EXCLUSION', value: 'X' },
    { label: '•', name: 'MULTIPLY', value: 'M' },
    { label: '•', name: 'SCREEN', value: 'S' },
    //{ label: '•', name: 'REPLACE', value: 'R' },
    { label: '•', name: 'OVERLAY', value: 'O' }
    //{ label: '•', name: 'HARD_LIGHT', value: 'H' },
    //{ label: '•', name: 'SOFT_LIGHT', value: 'F' },
    //{ label: '•', name: 'DODGE', value: 'G' },
    //{ label: '•', name: 'BURN', value: 'U' }
];

var DEFAULT_LAYERS_BLENDS = [
    /* layer-1: draw-pixels */ '', // normal
    /* layer-2: apply-gradient */ 'O', //overlay, after: blend
    /* layer-3: curves */ 'O', //overlay, after each: blend?
    /* layer-4: shapes */ 'S', // screen
    /* layer-5: edges & squares */ 'S', //screen
    /* layer-6: back edges */ 'O', // overlay
    /* layer-7: vignette */ 'O', // before: overlay, between: multiply, then: normal
    /* layer-8: logo */ 'N' // normal
];

var DEFAULT_LAYERS_OPACITIES = [
    1, /* layer-1: draw-pixels */
    1, /* layer-2: apply-gradient */
    1, /* layer-3: curves */
    1, /* layer-4: shapes */
    1, /* layer-5: edges & squares */
    1, /* layer-6: back edges */
    1, /* layer-7: vignette */
    1,  /* layer-8: logo */
    1
];

var DEFAULT_BLEND = '';

var blendToIndex = {};
BLENDS.forEach(function(blend, i) {
    blendToIndex[blend.value] = i;
});

function initBlendSwitchInGroup(target, id, count, width, height) {
    var lastSelected;
    var lastSelectedText;
    var switchStates = {};

    function switchBlend(blend, text) {
        return function() {
            if (lastSelected && (lastSelected.value !== blend.value) && lastSelectedText) {
                switchStates[lastSelected.value] = false;
                lastSelectedText.attr('fill', 'black');
            }
            if (!blend) return;
            var selected = switchStates[blend.value] ? false : true;
            switchStates[blend.value] = selected;
            text.attr('fill', selected ? 'white' : 'black');
            if (selected) {
                lastSelected = blend;
                lastSelectedText = text;
                return blend.value;
            } else {
                lastSelected = null;
                lastSelectedText = text;
                return '';
            }
        };
    }

    var submit, text, clicks;

    var texts;

    d3.select(target).append('g')
      .attr('transform', 'translate(0,' + ((id * height) + (height / 2) - (count * height / 2)) + ')')
      .call(function(target) {
          texts = BLENDS.map(function(blend, i) {
              return target.append('text').style('cursor', 'pointer')
                           .text(blend.label)
                           .attr('transform', 'translate(' + (i * LETTER_WIDTH) + ',0)');
          })

          texts.forEach(function(text, i) {
              text.append('title').text(BLENDS[i].name);
          });

          submit = Kefir.merge(
              BLENDS.map(function(blend, i) {
                  return Kefir.fromEvents(texts[i].node(), 'click')
                              .map(switchBlend(blend, texts[i]));
              })
          );
      });

    if (DEFAULT_LAYERS_BLENDS[id]) {
        var blendIdx = blendToIndex[DEFAULT_LAYERS_BLENDS[id]];
        switchBlend(BLENDS[blendIdx], texts[blendIdx])();
    }

    return submit;
}

var LAYERS_COUNT = 9;
Rpd.noderenderer('jb/layers', 'svg', function() {
    var count = LAYERS_COUNT;
    var state = { min: 0, max: 1 };
    var knobs = [];
    for (var i = 0; i < count; i++) {
        knobs.push(createKnob(state, defaultKnobConf));
    }

    var width = (BLENDS.length * LETTER_WIDTH) + 15 + defaultKnobConf.width;
    var height = count * (defaultKnobConf.height - 5);

    var modesX = (BLENDS.length * LETTER_WIDTH) - width - 3;
    var knobsX = 10 + (width - defaultKnobConf.width) - (width / 2);

    return {
        size: { width: width,
                height: height },
        //pivot: { x: 0, y: 0.5 },
        first: function(bodyElm) {
            var valueOut = Kefir.pool();
            var nodeRoot = bodyElm;
            var knobsRoot = d3.select(nodeRoot).append('g')
                              .attr('transform', 'translate(' + knobsX + ',0)')
                              .node();
            var defaultValueStream;
            var knobsOut = Kefir.combine(
                knobs.map(function(knob, i) {
                    defaultValueStream = Kefir.constant(DEFAULT_LAYERS_OPACITIES[i]);
                    return initKnobInGroup(knob, knobsRoot, i, count, defaultKnobConf.width, defaultKnobConf.height - 5, defaultValueStream)
                           .merge(defaultValueStream);
                           // knob.init() returns stream of updates,
                           // so Kefir.combine will send every change
                })
            );
            var switchersRoot = d3.select(nodeRoot).append('g')
                                  .attr('transform', 'translate(' + modesX + ',0)')
                                  .node();
            var blendsChanges = [];
            for (var i = 0; i < count; i++) {
                blendsChanges.push(initBlendSwitchInGroup(switchersRoot, i, count, 50, defaultKnobConf.height - 5)
                                   .merge(Kefir.constant(DEFAULT_LAYERS_BLENDS[i] || DEFAULT_BLEND)));
            }
            var blendsOut = Kefir.combine(blendsChanges);
            valueOut = knobsOut.combine(blendsOut).map(function(combined) {
                return combined[0].map(function(opacity, index) {
                    return {
                        opacity: opacity,
                        blendMode: combined[1][index]
                    }
                });
            });
            return {
                'renderOptions': { valueOut: valueOut }
            };
        }
    };
});

Rpd.noderenderer('jb/switch', 'svg', {
    size: { width: 30, height: 40 },
    first: function(bodyElm) {
        var valueOut = Kefir.emitter();
        var optionsCount = 2;
        var text, textClicks;
        var allClicks = [];
        for (var i = 0; i < optionsCount; i++) {
            text = d3.select(bodyElm).append('text')
                     .text(i + 1).attr('transform', 'translate(-5,' + ((i * 20) - 10) + ')')
                     .style('cursor', 'pointer');
            textClicks = Kefir.fromEvents(text.node(), 'click');
            textClicks.onValue((function(text) {
                return function() {
                    text.classed('highlighted', true);
                    setTimeout(function() {
                        text.classed('highlighted', false);
                    }, 1000);
                }
            })(text));
            allClicks.push(textClicks.map((function(i) { return function() { return i + 1; } })(i)));
        }
        return {
            'value': { valueOut: Kefir.merge(allClicks) }
        };
    }
});

function addColorRect(parent, color, size) {
    return d3.select(parent).append('rect')
                     .attr('width', size || 7).attr('height', size || 7)
                     .attr('rx', 1).attr('ry', 1)
                     .attr('fill', color || 'transparent')
                     .attr('stroke-width', 0.5)
                     .attr('stroke', 'white');
}

Rpd.channelrenderer('util/color', 'svg', {
    show: function(target, value, repr) {
        if (!value) return;
        addColorRect(target, repr).classed('jb-color-value', true);
    }
});

Rpd.channelrenderer('jb/palette', 'svg', {
    show: function(target, value, repr) {
        if (!value) return;
        var groupNode = d3.select(target).append('g')
                          .classed('jb-palette-value', true)
                          .node();
        value.forEach(function(color, i) {
            addColorRect(groupNode, color).style('transform', 'translate(' + (i * 10) + 'px, 0)');
        });
    }
});

Rpd.noderenderer('jb/three-colors', 'svg', function() {
    var group;
    return {
        first: function(bodyElm) {
            group = d3.select(bodyElm).append('g')
                      .attr('transform', 'translate(-10, -30)');
        },
        always: function(bodyElm, inlets, outlets) {
            if (!outlets.palette) return;
            group.empty();
            outlets.palette.forEach(function(color, i) {
                console.log(color, i);
                addColorRect(group.node(), color, 20).style('transform', 'translate(0, ' +  (i * 20) + 'px)');
            });
        }
    };
});
