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

    omni_app = new OmniApplication();

    omni_app.ready( function(app) {
        console.log("application ready.");
    });

    $(document).ready(function() {
        omni_app.kap.add_command('enter', function() {
            console.log('enter');
        });
        
        omni_app.kap.add_command('control-g', function() {
            console.log('control-g');
        });

        omni_app.finish_loading_app();
    });
})();
