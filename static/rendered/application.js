"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Application = (function () {
    function Application() {
        _classCallCheck(this, Application);

        this.controller_stack = [];
        this.kap = new kapture.Stack();
        this.event_emitter = new Beacon();
        this.roles = {};

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
        key: "register_role",
        value: function register_role(key, klass) {
            this.roles[key] = new klass();
        }
    }, {
        key: "fire_event",
        value: function fire_event(etype, options) {
            var len = this.controller_stack.length;
            for (var index = 1; index <= len; index++) {
                var controller = this.controller_stack[len - index];
                var result = controller.fire_event(etype, options);
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

var omni_app = new Application();

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
    kap_handler.add_active_command('shift-enter', function () {
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
    });

    omni_app.event_emitter.on('app:bar_updated', function () {
        var value = $("#ob-input").val();
        $("#fancy_input").html(value);
        omni_app.fire_event('app:bar_updated');
    });

    omni_app.event_emitter.on('command:cancel', function () {
        $("#ob-input").val('');
        $("#ob-input").blur();
    });

    omni_app.event_emitter.on('command:search', function () {
        $("#ob-input").val('?');
        $("#ob-input").focus();
    });

    omni_app.event_emitter.on('command:apply', function () {
        $("#ob-input").val('!');
        $("#ob-input").focus();
    });

    var list_controller = new ListController();
    omni_app.push_controller(list_controller);

    var bm = omni_app.roles['_base'];

    bm.scan().then(function (items) {
        items.forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var key = _ref2[0];
            var value = _ref2[1];

            var item = new Item(value);
            if (item.parse()['attr']['archived'] != true) {
                item.uid = bm.key(key);
                list_controller.add_item(item);
            }
        });
    });

    omni_app.event_emitter.fire('app:ready', omni_app);

    setTimeout(function () {
        $("#ob-input").focus();
    }, 0);

    setTimeout(function () {
        omni_app.refresh();
    }, 100);

    $("#fancy_input").on('click', function () {
        $("#ob-input").focus();
    });
});