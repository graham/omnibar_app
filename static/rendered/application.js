"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var str_trim = function str_trim(s) {
    return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, "");
};

var startswith = function startswith(s, prefix) {
    if (s.slice(0, prefix.length) == prefix) {
        return true;
    } else {
        return false;
    }
};

var Application = (function () {
    function Application() {
        _classCallCheck(this, Application);

        this.controller_stack = [];
        this.kap = new kapture.Stack();
        this.event_emitter = new Beacon();
        this.mixins = {};

        this.render_flag = 0;
        var _this = this;

        $(window).keydown(function (event) {
            var theTimeout = null;
            if (theTimeout == null && document.activeElement == $("#ob-input")[0]) {
                setTimeout(function () {
                    theTimeout = _this.event_emitter.fire('app:bar_updated');
                }, 0);
            }

            _this.kap.key_down(event);

            if (theTimeout == null && document.activeElement == $("#ob-input")[0]) {
                setTimeout(function () {
                    theTimeout = _this.event_emitter.fire('app:bar_updated');
                }, 0);
            }
        });
    }

    _createClass(Application, [{
        key: "fire_event",
        value: function fire_event() {
            var len = this.controller_stack.length;
            for (var index = 1; index <= len; index++) {
                var beacon = this.controller_stack[len - index].beacon;
                var result = beacon.fire.apply(beacon, arguments);
                if (result == true) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "refresh",
        value: function refresh() {
            this.event_emitter.fire("app:render");
        }
    }, {
        key: "ready",
        value: function ready(cb) {
            var _this2 = this;

            var _this = this;
            this.event_emitter.once('app:ready', cb);
            setTimeout(function () {
                _this2.refresh();
            }, 0);
        }
    }, {
        key: "present_controller",
        value: function present_controller(controller, options) {
            if (options === undefined) {
                options = {};
            }

            var finish_callback = function finish_callback(data) {
                $("#ob-content").html(data);
            };

            var controller_content = controller.render(finish_callback);

            if (controller_content === undefined || controller_content === null) {
                // we assume they will call the function in time.
            } else {
                    finish_callback(controller_content);
                }
        }
    }, {
        key: "push_controller",
        value: function push_controller(controller, options) {
            var _this = this;
            var stack_length = _this.controller_stack.length;
            var current_controller = _this.controller_stack[stack_length - 1];

            // lets let the current controller know we're hiding it.
            this.kap.push(controller.kap);
            controller.prepare();
            this.controller_stack.push(controller);
            this.present_controller(controller, options);
        }
    }, {
        key: "pop_controller",
        value: function pop_controller(options) {
            var _this = this;

            if (_this.controller_stack.length == 1) {
                // Sorry there must always be a controller on the stack.
                return false;
            } else {
                var stack_length = _this.controller_stack.length;
                var current_controller = _this.controller_stack[stack_length - 1];
                var new_controller = _this.controller_stack[stack_length - 2];

                // lets let the current controller know we're hiding it.

                this.kap.pop();
                _this.controller_stack.pop();
                this.present_controller(new_controller, options);
                return true;
            }
        }
    }]);

    return Application;
})();

var omni_app = null;

// TODO refactor this into something reasonable.
$(document).ready(function () {
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

    for (var key in global_active_keymap) {
        var value = global_active_keymap[key];
        kap_handler.add_command(key, (function (v) {
            return function () {
                omni_app.event_emitter.fire(v, {});
            };
        })(value));
    }

    for (var key in global_passive_keymap) {
        var value = global_passive_keymap[key];
        kap_handler.add_passive_command(key, (function (v) {
            return function () {
                omni_app.event_emitter.fire(v, {});
            };
        })(value));
    }

    for (var key in mvc_passive_keymap) {
        var value = mvc_passive_keymap[key];
        kap_handler.add_passive_command(key, (function (v) {
            return function () {
                omni_app.fire_event(v, {});
            };
        })(value));
    }

    for (var key in mvc_active_keymap) {
        var value = mvc_active_keymap[key];
        kap_handler.add_command(key, (function (v) {
            return function () {
                omni_app.fire_event(v, {});
            };
        })(value));
    }

    // Moving the cursor, whatever the controller is.
    kap_handler.add_push('control-x');

    // When you hit enter.
    kap_handler.add_active_command('enter', function () {
        omni_app.fire_event('command:enter');
    });

    // Commands for getting to and away from the omnibar.
    kap_handler.add_command('esc', function () {
        $("#ob-input").blur();
    });

    kap_handler.add_passive_command('/', function () {
        $("#ob-input").focus();
    });

    //
    // End of Key Commands
    //

    // listen.
    omni_app.event_emitter.on('app:render', function () {
        var stack_length = omni_app.controller_stack.length;
        var current_controller = omni_app.controller_stack[stack_length - 1];
        omni_app.present_controller(current_controller);
        omni_app.fire_event('app:bar_updated');
    });

    omni_app.event_emitter.on('app:bar_updated', function () {
        var value = $("#ob-input").val();
        $("#fancy_input").html(value);
    });

    omni_app.event_emitter.on('command:cancel', function () {
        $("#ob-input").val('');
        $("#ob-input").blur();
    });

    omni_app.event_emitter.on('command:search', function () {
        $("#ob-input").val('?');
        $("#ob-input").focus();
    });

    var list_controller = new ListController();
    omni_app.push_controller(list_controller);
    omni_app.event_emitter.fire('app:ready', omni_app);

    setTimeout(function () {
        $("#ob-input").focus();
    }, 0);

    $("#fancy_input").on('click', function () {
        $("#ob-input").focus();
    });
});

var extension = function extension(s) {
    return s.substr(s.lastIndexOf('.') + 1);
};

var ResourceManager = (function () {
    function ResourceManager() {
        _classCallCheck(this, ResourceManager);

        this.resources = new Map();
    }

    _createClass(ResourceManager, [{
        key: "update",
        value: function update(url) {
            this.remove_from_page(url);
            this.add_to_page(url);
        }
    }, {
        key: "add_to_page",
        value: function add_to_page(url) {
            var uid = this.guid();
            var ext = extension(url);
            var ms = new Date().getTime();

            var resource = null;
            if (ext == 'js') {
                resource = document.createElement('script');
                resource.src = url + '#' + ms;
            } else if (ext == 'css') {
                resource = document.createElement('link');
                resource.href = url;
                resource.rel = 'stylesheet';
                resource.type = 'text/css';
            } else {
                return;
            }

            resource.id = uid;
            this.resources.set(url, uid);
            document.head.appendChild(resource);
        }
    }, {
        key: "remove_from_page",
        value: function remove_from_page(url) {
            var id = this.resources.get(url);
            if (id) {
                var d = document.getElementById(id);
                document.head.removeChild(d);
            }
        }
    }, {
        key: "guid",
        value: function guid() {
            var s4 = function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            };
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    }]);

    return ResourceManager;
})();