function initP5(w, h) {
    return function(p) {
        p.setup = function() {
            var c = p.createCanvas(w, h);
            c.addClass('p5-canvas');
            p.noLoop();
        };
        p.draw = function() {
            p.clear();
            p.background(0, 0);
            //drawForms(p, getForms() || []);
        };
    }
}

/* function maybeCachedImage(p, f) {
    return p.createImg(f.data);
} */

var DEFAULT_PALETTE = [
    '#F9A857',
    '#EC7B45',
    '#FB5502',
    '#FB2046',
    '#E32581',
    '#D73CEA',
    '#9135E0',
    '#961F8C',
    '#5E2495',
    '#5848F4',
    '#05C1FD',
    '#18D68C',
    '#FCF84A'
];

var PALETTES = [
    [ '#ff0000', '#00ff00', '#0000ff' ], // neon-1
    [ '#ffff00', '#ff00ff', '#00ffff' ], // neon-2
    [ '#ec4476', '#fde74a', '#9151e1' ], // jetbrains-1
    [ '#dc57e4', '#eb3d7e', '#ec6e55', '#22c5fc' ], // jetbrains-2
    [ '#dc57e4', '#eb3984', '#783d96', '#22c5fc' ], // jetbrains-3
    [ '#1a7ff6', '#fb3560', '#f77a29' ],  // idea // IJ_
    [ '#31d68b', '#fcf65a', '#24c4f0' ],  // pycharm // PC_
    [ '#22b1ef', '#9062f7', '#fc378c' ],  // youtrack // YT_
    [ '#fc1681', '#786bfb', '#e14ce3' ],  // dottrace // DT_
    [ '#c21456', '#e14ce3', '#fdbc2c' ],  // resharper // R#_
    [ '#b24eee', '#7660f4', '#fc378c' ],  // phpstorm // PS_
    [ '#fc2555', '#fd8638', '#8f41cd' ],  // rubymine // RM_
    [ '#22b1ef', '#9062f7', '#46e869' ],  // teamcity // TC_
    [ '#fd7522', '#786bfb', '#e14ce3' ],  // dotcover // DC_
    [ '#fdbc2c', '#e14ce3', '#c21456' ],  // // R++_
    [ '#2b7fe3', '#25daee', '#30de95' ],  // actioncode // AC_
    [ '#22cdd6', '#2888d4', '#feee56' ],  // webstorm // WS_
    [ '#22b1ef', '#9062f7', '#fd8224' ],  // upsource // UP_
    [ '#fdbc2c', '#786bfb', '#e14ce3' ],  // // DM_
    [ '#31d68b', '#3188cd', '#f1e969' ],  // mps // MPS_
    [ '#32d791', '#1a9edd', '#ea3a8c' ],  // clion // CL_
    [ '#32d791', '#9779f5', '#fd5fe4' ],  // // DG_
    [ '#1fb9ee', '#965ff7', '#feec56' ],  // hub // HB_
    [ '#23cbfc', '#786bfb', '#e14ce3' ],  // // DP_
    [ '#1b84f2', '#24dea7', '#ed4baa' ]   // kotlin // KT_
];

function numberToHex(num) { return (num > 15) ? num.toString(16) : '0' + num.toString(16); }

function toHexColor(color) {
    return '#' + numberToHex(color.r || 0)
               + numberToHex(color.g || 0)
               + numberToHex(color.b || 0);
}

function _rgb(r, g, b, a) {
    return { r: r, g: g, b: b, a: a };
}
