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

var PRODUCTS = [


    { label: 'IJ_',  id: 'intellij-idea', palette: [ '#1a7ff6', '#fb3560', '#f77a29' ] },  // idea // IJ_
    { label: 'PC_',  id: 'pycharm',       palette: [ '#31d68b', '#fcf65a', '#24c4f0' ] },  // pycharm // PC_
    { label: 'YT_',  id: 'youtrack',      palette: [ '#22b1ef', '#9062f7', '#fc378c' ] },  // youtrack // YT_
    { label: 'DT_',  id: 'dottrace',      palette: [ '#fc1681', '#786bfb', '#e14ce3' ] },  // dottrace // DT_
    { label: 'R#_',  id: 'resharper',     palette: [ '#c21456', '#e14ce3', '#fdbc2c' ] },  // resharper // R#_
    { label: 'PS_',  id: 'phpstorm',      palette: [ '#b24eee', '#7660f4', '#fc378c' ] },  // phpstorm // PS_
    { label: 'RM_',  id: 'rubymine',      palette: [ '#fc2555', '#fd8638', '#8f41cd' ] },  // rubymine // RM_
    { label: 'TC_',  id: 'teamcity',      palette: [ '#22b1ef', '#9062f7', '#46e869' ] },  // teamcity // TC_
    { label: 'DC_',  id: 'dotcover',      palette: [ '#fd7522', '#786bfb', '#e14ce3' ] },  // dotcover // DC_
    { label: 'R++',  id: 'resharper-cpp', palette: [ '#fdbc2c', '#e14ce3', '#c21456' ] },  // // R++_
    { label: 'AC_',  id: 'appcode',       palette: [ '#2b7fe3', '#25daee', '#30de95' ] },  // appcode // AC_
    { label: 'WS_',  id: 'webstorm',      palette: [ '#22cdd6', '#2888d4', '#feee56' ] },  // webstorm // WS_
    { label: 'UP_',  id: 'upsource',      palette: [ '#22b1ef', '#9062f7', '#fd8224' ] },  // upsource // UP_
    { label: 'DM_',  id: 'dotmemory',     palette: [ '#fdbc2c', '#786bfb', '#e14ce3' ] },  // // DM_
    { label: 'MPS_', id: 'mps',           palette: [ '#31d68b', '#3188cd', '#f1e969' ] },  // mps // MPS_
    { label: 'CL_',  id: 'clion',         palette: [ '#32d791', '#1a9edd', '#ea3a8c' ] },  // clion // CL_
    { label: 'DG_',  id: 'datagrip',      palette: [ '#32d791', '#9779f5', '#fd5fe4' ] },  // // DG_
    { label: 'HB_',  id: 'hub',           palette: [ '#1fb9ee', '#965ff7', '#feec56' ] },  // hub // HB_
    { label: 'DP_',  id: 'dotproduct',    palette: [ '#23cbfc', '#786bfb', '#e14ce3' ] },  // // DP_
    { label: 'KT_',  id: 'kotlin',        palette: [ '#1b84f2', '#24dea7', '#ed4baa' ] },   // kotlin // KT_
    { label: 'N1',   id: 'neon-1',        palette: [ '#ff0000', '#00ff00', '#0000ff' ] }, // neon-1
    { label: 'N2',   id: 'neon-2',        palette: [ '#ffff00', '#ff00ff', '#00ffff' ] }, // neon-2
    { label: 'JB1',  id: 'jetbrains-1',   palette: [ '#ec4476', '#fde74a', '#9151e1' ] }, // jetbrains-1
    { label: 'JB2',  id: 'jetbrains-2',   palette: [ '#dc57e4', '#eb3d7e', '#ec6e55', '#22c5fc' ] }, // jetbrains-2
    { label: 'JB3',  id: 'jetbrains-3',   palette: [ '#dc57e4', '#eb3984', '#783d96', '#22c5fc' ] } // jetbrains-3
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

function howMuch(single, plural) {
    return function(list) {
        if (!list) return 'Nothing';
        if (list.length == 0) return 'No ' + plural;
        if (list.length == 1) return 'One ' + single;
        if (list.length == 2) return 'Two ' + plural;
        return list.length + ' ' + plural;
    };
}

function stopPropagation(event) {
    event.stopPropagation();
    return event;
}
