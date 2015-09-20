var str_trim = function(s) { 
    return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, "");
};

var startswith = function(s, prefix) {
    if (s.slice(0, prefix.length) == prefix) {
        return true;
    } else {
        return false;
    }
};

var ViewController = Class.extend({
    init: function() {
        this.beacon = new Beacon();
        console.log('init inside view.');
    },
    
    render: function() {
        console.log("Core View rendering.");
        var d = document.createElement('div')
        d.innerHTML = "Someone didn't implement the render method on their view. :(";
        return d;
    },
    
    prepare: function() {
        console.log("Prepare basic ViewController.");
    },
    
    destroy: function() {
        console.log("Destroy basic ViewController.");
    },
    
    will_hide_view: function() {},
    will_show_view: function() {},
    did_hide_view: function() {},
    did_show_view: function() {}
});
