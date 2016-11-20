var SVG_XMLNS = "http://www.w3.org/2000/svg";
var HTML_XMLNS = "http://www.w3.org/1999/xhtml";

var lastCvsId = 0;
Rpd.noderenderer('jb/render', 'svg', function() {
    return {
        size: { width: 420, height: 320 },
        pivot: { x: 0, y: 0 },
        first: function(bodyElm) {
            var canvasId = 'p5-canvas-' + lastCvsId;
            var group = document.createElementNS(SVG_XMLNS, 'g');
            group.setAttributeNS(null, 'transform', 'translate(10, 10)');
            var foreign = document.createElementNS(SVG_XMLNS, 'foreignObject');
            var p5Target = document.createElementNS(HTML_XMLNS, 'div');
            p5Target.id = canvasId;
            p5Target.className = 'p5-canvas';
            foreign.appendChild(p5Target);
            group.appendChild(foreign);
            bodyElm.appendChild(group);
            new p5(initP5, canvasId);
            lastCvsId++;
        },
        always: function() {}
    };
});
