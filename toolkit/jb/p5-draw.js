function initP5(formsRef) {
    return function(p) {
        p.setup = function() {
            p.createCanvas(180, 180);
        };
        p.draw = function() {
            p.background(p.color(255,255,255));
            drawForms(p, formsRef.forms);
        };
    }
}

function drawForms(p, forms) {
    forms.forEach(function(formF) { formF(p); });
}
