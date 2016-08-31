module.exports = function(markup) {
    if (typeof document !== 'undefined') return;
    var jsdom               = require("jsdom").jsdom;
    global.document         = jsdom(markup || '<!doctype html><html><body></body></html>');
    global.window		    = document.defaultView;

    global.navigator        = global.window.navigator = {};
    navigator.userAgent     = 'NodeJs JsDom';
    navigator.appVersion    = '';

    return document;
};
