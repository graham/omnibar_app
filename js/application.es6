class Application {
    constructor() {
        this.controller_stack = []
        this.kap = new kapture.Stack()
        this.event_emitter = new Beacon()
        this.roles = {}
        
        this.render_flag = 0;
        let _this = this;

        $(window).keydown( (event) => {
            var theTimeout = null;
            if (theTimeout == null && document.activeElement == $("#ob-input")[0]) {
                setTimeout(() => {
                    theTimeout = _this.event_emitter.fire('app:bar_updated');
                }, 0);
            }

            _this.kap.key_down(event);

            if (theTimeout == null && document.activeElement == $("#ob-input")[0]) {
                setTimeout(() => {
                    theTimeout = _this.event_emitter.fire('app:bar_updated');
                }, 0);
            }
        });
    }

    register_role(key, klass) {
        this.roles[key] = new klass()
    }

    fire_event(etype, options) {
        var len = this.controller_stack.length;
        for(var index=1; index <= len; index++) {
            var controller = this.controller_stack[len-index];
            var result = controller.fire_event(etype, options)
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

    present_controller(controller, options) {
        if (options === undefined) {
            options = {};
        }

        var finish_callback = function(data) {
            $("#ob-content").html(data);
        }
        
        var controller_content = controller.render(finish_callback);
        
        if (controller_content === undefined || controller_content === null) {
            // we assume they will call the function in time.
        } else {
            finish_callback(controller_content)
        }
    }

    push_controller(controller, options) {
        var _this = this;
        var stack_length = _this.controller_stack.length;
        var current_controller = _this.controller_stack[stack_length-1];
        
        // lets let the current controller know we're hiding it.
        this.kap.push(controller.kap);
        controller.prepare();
        this.controller_stack.push(controller);
        this.present_controller(controller, options);

    }

    pop_controller(options) {
        var _this = this;
        
        if (_this.controller_stack.length == 1) {
            // Sorry there must always be a controller on the stack.
            return false;
        } else {
            var stack_length = _this.controller_stack.length;
            var current_controller = _this.controller_stack[stack_length-1];
            var new_controller =     _this.controller_stack[stack_length-2];

            // lets let the current controller know we're hiding it.

            this.kap.pop();
            _this.controller_stack.pop();
            this.present_controller(new_controller, options);
            return true;
        }
    }
}

var omni_app = new Application()

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

    //
    // Key Commands
    //

    var kap_handler = omni_app.kap.get_root_handler();

    for(var key in global_active_keymap) {
        var value = global_active_keymap[key];
        kap_handler.add_command(key, (function(v) {
            return function() {
                omni_app.event_emitter.fire(v, {});
            };
        })(value));
    }

    for(var key in global_passive_keymap) {
        var value = global_passive_keymap[key];
        kap_handler.add_passive_command(key, (function(v) {
            return function() {
                omni_app.event_emitter.fire(v, {});
            };
        })(value));
    }

    for(var key in mvc_passive_keymap) {
        var value = mvc_passive_keymap[key];
        kap_handler.add_passive_command(key, (function(v) {
            return function() {
                omni_app.fire_event(v, {});
            };
        })(value));
    }

    for(var key in mvc_active_keymap) {
        var value = mvc_active_keymap[key];
        kap_handler.add_command(key, (function(v) {
            return function() {
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
    kap_handler.add_active_command('shift-enter', function() {
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
        var stack_length = omni_app.controller_stack.length;
        var current_controller = omni_app.controller_stack[stack_length-1];
        omni_app.present_controller(current_controller);
    });

    omni_app.event_emitter.on('app:bar_updated', function() {
        var value = $("#ob-input").val();
        $("#fancy_input").html(value);
        omni_app.fire_event('app:bar_updated');
    });

    omni_app.event_emitter.on('command:cancel', function() {
        $("#ob-input").val('');
        $("#ob-input").blur();
    });

    omni_app.event_emitter.on('command:search', function() {
        $("#ob-input").val('?');
        $("#ob-input").focus();
    });

    omni_app.event_emitter.on('command:apply', function() {
        $("#ob-input").val('!');
        $("#ob-input").focus();
    });

    var list_controller = new ListController();
    omni_app.push_controller(list_controller);

    let bm = omni_app.roles['_base']
    
    bm.storage.keys().then((items) => {
        if (items.length == 0) {
            let new_items = [
                "an email $id=1515c49e0782c93a ;email",
                "a config option ;config (star me!)",
                "tags got me like #fuckyeah ;tag",
                "http://news.ycombinator.com/",
                "http://lobste.rs",
                "focus on me and hit v to see the code. https://github.com/graham/omnibar_app/blob/master/js/extra.es6"
            ]

            new_items.forEach((text) => {
                var item = Item.from_text(text)
                item.on_event('create', {})
                list_controller.add_item(item)
            })
        } else {
            items.forEach((key) => {
                bm.storage.get_item(key).then((item) => {
                    list_controller.add_item(item)
                })
            })
        }
    })

    addEvent(window, 'storage', function (event) {
        console.log('storage change')
        bm.storage.scan().then((items) => {
            list_controller.item_list = []
            items.forEach(([key, item]) => {
                list_controller.add_item(item)
            })
            omni_app.refresh()
        })
    })

    omni_app.event_emitter.fire('app:ready', omni_app);
    
    setTimeout(() => {
        $("#ob-input").focus();
    }, 0);

    setTimeout(() => {
        omni_app.refresh()
    }, 100);

    $("#fancy_input").on('click', function() {
        $("#ob-input").focus();
    });
});

