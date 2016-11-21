var SVG_XMLNS = "http://www.w3.org/2000/svg";
var HTML_XMLNS = "http://www.w3.org/1999/xhtml";

var lastCvsId = 0;
Rpd.noderenderer('jb/render', 'svg', function() {
    var formsRef = {};
    var myP5;
    return {
        size: { width: 200, height: 200 },
        pivot: { x: 0, y: 0 },
        first: function(bodyElm) {
            var wrapperId = 'p5-canvas-' + lastCvsId;
            var wrapper = createCanvasWrapper(wrapperId, bodyElm);
            myP5 = new p5(initP5(formsRef), wrapper);
            lastCvsId++;
        },
        always: function(bodyElm, inlets) {
            formsRef.forms = inlets.forms;
            if (inlets.forms.length) myP5.redraw();
        }
    };
});

Rpd.noderenderer('jb/layers', 'svg', {
    size: { width: 150 }
});

Rpd.noderenderer('jb/modify', 'svg', {
    size: { width: 100 }
});

Rpd.noderenderer('jb/image', 'svg', function() {
    var myP5, lastImage, lastFileName;
    return {
        size: { width: 200, height: 200 },
        pivot: { x: 0, y: 0 },
        first: function(bodyElm) {
            var wrapperId = 'p5-canvas-' + lastCvsId;
            var wrapper = createCanvasWrapper(wrapperId, bodyElm);
            var node = this;
            console.log(wrapperId, wrapper);
            myP5 = new p5(function(p) {
                p.setup = function() { var c = p.createCanvas(180, 180);
                                       c.drop(function(file) {
                                           console.log('received from drop', file);
                                           if (file.type === 'image') {
                                               var image = p.createImg(file.data).hide();
                                               node.inlets['image'].receive(image);
                                               node.inlets['filename'].receive(file.name);
                                           }
                                       });
                                       c.style("visibility", "visible"); // FIXME: why needed?
                                       p.background(100);
                                       p.noLoop(); };
                p.draw = function() {
                    p.fill(255);
                    if (lastImage) p.image(lastImage, 0, 0, p.width, p.height);
                    p.noStroke();
                    p.textSize(12);
                    p.textAlign(p.CENTER);
                    if (!lastImage) {
                        p.text('Drag an image file\nonto the canvas.', p.width/2, p.height/2);
                    } else if (lastFileName) {
                        console.log('text', lastFileName);
                        p.text(lastFileName, p.width/2, p.height/2);
                    }
                };
            }, wrapper);
            console.log(myP5);
            myP5.redraw();
            lastCvsId++;
        },
        always: function(bodyElm, inlets) {
            if (inlets.image) {
                lastImage = inlets.image;
                lastFileName = inlets.filename;
                myP5.redraw();
            }
        }
    };
});

function createCanvasWrapper(wrapperId, bodyElm) {
    var group = document.createElementNS(SVG_XMLNS, 'g');
    group.setAttributeNS(null, 'transform', 'translate(10, 10)');
    var foreign = document.createElementNS(SVG_XMLNS, 'foreignObject');
    var wrapper = document.createElementNS(HTML_XMLNS, 'div');
    wrapper.id = wrapperId;
    wrapper.className = 'p5-canvas';
    foreign.appendChild(wrapper);
    group.appendChild(foreign);
    bodyElm.appendChild(group);
    return wrapper;
}
