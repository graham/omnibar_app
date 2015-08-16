var omni_app = null;

(function() {
    var storage = localStorage;

    var str_trim = function(s) { return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, ""); };
    var dottime = function() { return Math.floor((new Date).getTime() / 1000); };
    var dottimem = function() { return Math.floor((new Date).getTime()); };
    var ensure_https = function() {
        if (document.location.href.slice(0, 5) == 'http:') {
            document.location = 'https:' + document.location.href.slice(6);
        }
    };
    
    var x_in_list = function(x, the_list) {
        var l = the_list.length;
        for(var i = 0; i < l; i += 1) {
            if (x == the_list[i]) {
                return true;
            }
        }
        return false;
    };

    var Application = function() {
        this.after_load = [];
    };

    Application.prototype.ready = function(cb) {
        this.after_load.push(cb);
    };

    Application.prototype.finish_loading_app = function() {
        var _this = this;
        for(var i = 0; i < this.after_load.length; i++) {
            this.after_load[i](_this);
        }
    };
    
    omni_app = new Application();

    omni_app.ready( function(app) {

    });

    $(document).ready(function() {
        omni_app.kap = new kapture.Kapture();
        $(window).keydown(function(event) {
            omni_app.kap.key_down(event);
        });
        
        omni_app.kap.add_command('enter', function() {
        });
        
        omni_app.kap.add_command('control-g', function() {
        });

        omni_app.finish_loading_app();
    });
})();
