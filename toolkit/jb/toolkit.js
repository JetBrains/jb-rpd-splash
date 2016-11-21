Rpd.channeltype('jb/forms', {
    show: function(forms) { return forms.length ? (forms.length + ' Forms') : 'No Forms'; }
});

Rpd.nodetype('jb/render', {
    inlets: {
        forms: { type: 'jb/forms', 'default': [] }
    },
    process: function() {}
});

Rpd.nodetype('jb/ellipse', {
    inlets: {
        'bang': { 'type': 'core/any' }
    },
    outlets: {
        'forms': { type: 'jb/forms' }
    },
    process: function() {
        return {
            'forms': [ function(p) {
                p.ellipse(50, 50, 80, 80);
            } ]
        }
    }
});
