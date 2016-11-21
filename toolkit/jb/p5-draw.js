function initP5(formsRef) {
    return function(p) {
        //p.setup = function() {};
        p.draw = function() {
            drawForms(p, formsRef.forms);
        };
    }
}

function drawForms(p, forms) {
    forms.forEach(function(formF) { formF(p); });
}
