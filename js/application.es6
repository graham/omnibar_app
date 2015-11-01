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

class Application {
    constructor() {
        this.view_stack = [];

        this.event_emitter = new Beacon();
        this.kap = new kapture.Stack();
        
        this.plugin_manager = new PluginManager();
        
        this.render_flag = 0;
        let _this = this;

        $(window).keydown( (event) => {
            _this.kap.key_down(event);
            if (document.activeElement == $("#ob-input")[0]) {
                setTimeout(() => {
                    _this.event_emitter.fire('app:bar_updated');
                }, 0);
            }
        });
    }

    fire_event() {
        var len = this.view_stack.length;
        for(var index=1; index <= len; index++) {
            var beacon = this.view_stack[len-index].beacon;
            var result = beacon.fire.apply(beacon, arguments);
            if (result == true) {
                return true;
            }
        }
        return false;
    }

    refresh() {
        this.event_emitter.fire("app:render");
    }

    ready(cb) {
        var _this = this;
        this.event_emitter.once('app:ready', cb);
        setTimeout(() => {
            this.refresh();
        }, 0);
    }

    present_view(view, options) {
        if (options === undefined) {
            options = {};
        }

        var finish_callback = function(data) {
            $("#ob-content").html(data);
        }
        
        var view_content = view.render(finish_callback);
        
        if (view_content === undefined || view_content === null) {
            // we assume they will call the function in time.
        } else {
            finish_callback(view_content)
        }
    }

    push_view(view, options) {
        var _this = this;
        var stack_length = _this.view_stack.length;
        var current_view = _this.view_stack[stack_length-1];
        
        // lets let the current view know we're hiding it.
        this.kap.push(view.kap);
        view.prepare();
        this.view_stack.push(view);
        this.present_view(view, options);

    }

    pop_view(options) {
        var _this = this;
        
        if (_this.view_stack.length == 1) {
            // Sorry there must always be a view on the stack.
            return false;
        } else {
            var stack_length = _this.view_stack.length;
            var current_view = _this.view_stack[stack_length-1];
            var new_view =     _this.view_stack[stack_length-2];

            // lets let the current view know we're hiding it.

            this.kap.pop();
            _this.view_stack.pop();
            this.present_view(new_view, options);
            return true;
        }
    }
}

var omni_app = null;

// TODO refactor this into something reasonable.
$(document).ready(function() {
    var hostname = window.location.hostname;
    if (hostname == 'localhost' || hostname == '127.0.0.1') {
        // pass, easier to understand formatted this way.
    } else {
        if (document.location.href.slice(0, 5) == 'http:') {
            document.location = 'https:' + document.location.href.slice(6);
        }
    }

    omni_app = new Application();

    //
    // Key Commands
    //

    var kap_handler = omni_app.kap.get_root_handler();

    for(var key in global_active_keymap) {
        var value = global_active_keymap[key];
        kap_handler.add_command(key, (function(v) {
            return function() {
                console.log(v);
                omni_app.event_emitter.fire(v, {});
            };
        })(value));
    }

    for(var key in global_passive_keymap) {
        var value = global_passive_keymap[key];
        kap_handler.add_passive_command(key, (function(v) {
            return function() {
                console.log(v);
                omni_app.event_emitter.fire(v, {});
            };
        })(value));
    }

    for(var key in mvc_passive_keymap) {
        var value = mvc_passive_keymap[key];
        kap_handler.add_passive_command(key, (function(v) {
            return function() {
                console.log(v);
                omni_app.fire_event(v, {});
            };
        })(value));
    }
    
    for(var key in mvc_active_keymap) {
        var value = mvc_active_keymap[key];
        kap_handler.add_command(key, (function(v) {
            return function() {
                console.log(v);
                omni_app.fire_event(v, {});
            };
        })(value));
    }

    // Moving the cursor, whatever the controller is.
    kap_handler.add_push('control-x');

    // When you hit enter.
    kap_handler.add_active_command('enter', function() {
        omni_app.fire_event('command:enter');
    });

    // Commands for getting to and away from the omnibar.
    kap_handler.add_command('esc', function() {
        $("#ob-input").blur();
    });

    kap_handler.add_passive_command('/', function() {
        $("#ob-input").focus();
    });

    //
    // End of Key Commands 
    //
    
    // listen.
    omni_app.event_emitter.on('app:render', function() {
        var stack_length = omni_app.view_stack.length;
        var current_view = omni_app.view_stack[stack_length-1];
        omni_app.present_view(current_view);
    });

    omni_app.event_emitter.on('app:bar_updated', function() {
        console.log($("#ob-input").val());
    });

    omni_app.event_emitter.on('command:cancel', function() {
        $("#ob-input").val('');
        $("#ob-input").blur();
    });
    
    omni_app.event_emitter.on('command:search', function() {
        $("#ob-input").val('?');
        $("#ob-input").focus();
    });

    omni_app.event_emitter.on('command:go', function() {
        $("#ob-input").val('go:');
        $("#ob-input").focus();
    });
    
    omni_app.event_emitter.on('command:filter', function() {
        $("#ob-input").val('filter:');
        $("#ob-input").focus();
    });

    omni_app.event_emitter.on('command:do', function() {
        $("#ob-input").val('![');
        $("#ob-input").focus();
    });

    var stock_view = new SourceController();
    omni_app.push_view(stock_view);
    
    omni_app.event_emitter.fire('app:ready', omni_app);
    setTimeout(() => {
        $("#ob-input").focus();
    }, 0);
    
});


