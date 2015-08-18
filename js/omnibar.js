var omni_app = null;
var omni_app_data = {};

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
            omni_app.event_emitter.fire('cmd:enter');
        });
        
        omni_app.kap.add_command('control-g', function() {
            omni_app.event_emitter.fire('cmd:cancel');
        });

        omni_app.kap.add_push('control-x');
        omni_app.kap.add_command('control-x control-s', function(term) {
            omni_app.event_emitter.fire('cmd:save');
        });

        omni_app.kap.add_command('control-x control-c', function(term) {
            omni_app.event_emitter.fire('cmd:reload');
        });

        omni_app.event_emitter.on('*', function(args) {
            console.log(new Date().toISOString() + " - " + (dottime() - omni_app_data.timers.start) +
                        " - EventLog: " + args);
        });

        omni_app.event_emitter.once('cmd:reload', function() {
            window.location.reload();
        });

        omni_app_data.timers = {};
        omni_app_data.timers.start = dottime();
        
        omni_app.event_emitter.fire('ready');
    });
})();
