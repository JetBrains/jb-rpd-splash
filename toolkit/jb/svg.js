var SVG_XMLNS = "http://www.w3.org/2000/svg";
var HTML_XMLNS = "http://www.w3.org/1999/xhtml";

var lastCvsId = 0;

Rpd.noderenderer('jb/render', 'svg', function() {
    function getForms() { return lastForms; };
    var myP5;
    return {
        size: { width: 200, height: 200 },
        pivot: { x: 0, y: 0 },
        first: function(bodyElm) {
            var wrapperId = 'p5-canvas-' + lastCvsId;
            var wrapper = createCanvasWrapper(wrapperId, bodyElm);
            myP5 = new p5(initP5(getForms, 180, 180), wrapper);
            lastCvsId++;
        },
        always: function(bodyElm, inlets) {
            lastForms = inlets.forms;
            if (lastForms && lastForms.length) myP5.redraw();
        }
    };
});

Rpd.noderenderer('jb/preview', 'svg', function() {
    function getForms() { return lastForms; };
    var myP5;
    return {
        size: { width: 700, height: 394 },
        pivot: { x: 0, y: 0 },
        first: function(bodyElm) {
            var wrapperId = 'p5-canvas-' + lastCvsId;
            var wrapper = createCanvasWrapper(wrapperId, bodyElm);
            //var fullScreenTrigger = document.createElementNS(HTML_XMLNS, 'span');
            //fullScreenTrigger.className = 'fullscreen-trigger';
            //fullScreenTrigger.innerText = 'FULLSCREEN';
            myP5 = new p5(initP5(getForms, 700, 394/*, fullScreenTrigger*/), wrapper);
            //wrapper.appendChild(fullScreenTrigger);
            lastCvsId++;
        },
        always: function(bodyElm, inlets) {
            lastForms = inlets.forms;
            if (lastForms && lastForms.length) myP5.redraw();
        }
    };
});

Rpd.noderenderer('jb/layers', 'svg', {
    size: { width: 50 }
});

Rpd.noderenderer('jb/transform', 'svg', {
    size: { width: 50 }
});

Rpd.noderenderer('jb/style', 'svg', {
    size: { width: 50 }
});

Rpd.noderenderer('jb/image', 'svg', function() {
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
});

function createCanvasWrapper(wrapperId, bodyElm) {
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
}

function createP5ForImageDrop(node, inletName, getFile) {
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
}

function prepareCanvas(myP5Canvas) {
    myP5Canvas.className = 'p5-canvas';
}
