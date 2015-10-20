"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = (function () {
    function View() {
        _classCallCheck(this, View);
    }

    _createClass(View, [{
        key: "render",
        value: function render() {
            return "hello world";
        }
    }]);

    return View;
})();

var ViewController = (function (_View) {
    _inherits(ViewController, _View);

    function ViewController() {
        _classCallCheck(this, ViewController);

        _get(Object.getPrototypeOf(ViewController.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(ViewController, [{
        key: "contructor",
        value: function contructor() {
            this.beacon = new Beacon();
            console.log('init inside view.');
        }
    }, {
        key: "render",
        value: function render() {
            console.log("Core View rendering.");
            var d = document.createElement('div');
            d.innerHTML = "Someone didn't implement the render method on their view. :(";
            return d;
        }
    }, {
        key: "prepare",
        value: function prepare() {
            console.log("Prepare basic ViewController.");
        }
    }, {
        key: "destroy",
        value: function destroy() {
            console.log("Destroy basic ViewController.");
        }
    }]);

    return ViewController;
})(View);

var OmniListController = (function (_ViewController) {
    _inherits(OmniListController, _ViewController);

    function OmniListController() {
        _classCallCheck(this, OmniListController);

        // Call the superclass init with nothing.
        _get(Object.getPrototypeOf(OmniListController.prototype), "constructor", this).call(this);

        // Now some local stuff.
        this.item_list_key = 'wndrfl_list_items';
        this.cursor_index = 0;
        this.beacon = new Beacon();
    }

    _createClass(OmniListController, [{
        key: "run_command",
        value: function run_command(value) {
            var _this = this;
            var last_command = null;
            if (value == 'do:value') {
                for (var i = 0; i < 10; i++) {
                    last_command = mydbconn.cmd('rpush', _this.item_list_key, { 'content': 'a word ' + i });
                }
                this.cursor_index = 0;
                if (last_command) {
                    last_command.then(function () {
                        omni_app.refresh();
                    });
                } else {
                    setTimeout(function () {
                        omni_app.refresh();
                    }, 0);
                }
            }
        }
    }, {
        key: "get_selected",
        value: function get_selected() {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var return_values = [];
                mydbconn.cmd('lrange', _this.item_list_key, 0, -1).then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        obj.index = i;

                        if (obj['selected'] == true) {
                            return_values.push(obj);
                        }
                    }
                    resolve(return_values);
                });
            });
        }
    }, {
        key: "map_selected",
        value: function map_selected(fn) {
            var _this = this;
            return _this.get_selected().then(function (values) {
                var last_promise = null;
                var indexs_to_remove = [];
                var ps = [];

                for (var i = 0; i < values.length; i++) {
                    (function (index, item) {
                        var result = fn(item);
                        if (result) {
                            mydbconn.cmd('lset', _this.item_list_key, item.index, result);
                        } else {
                            indexs_to_remove.push(item.index);
                        }
                    })(i, values[i]);
                }

                for (var i = indexs_to_remove.length - 1; i >= 0; i--) {
                    (function (index, item) {
                        ps.push(mydbconn.cmd('lremindex', _this.item_list_key, item));
                    })(i, indexs_to_remove[i]);
                }

                return mydbconn.all(ps);
            });
        }
    }, {
        key: "get_focused",
        value: function get_focused() {
            var _this = this;
            return mydbconn.cmd('lindex', _this.item_list_key, _this.cursor_index);
        }
    }, {
        key: "map_focused",
        value: function map_focused(fn) {
            var _this = this;
            return _this.get_focused().then(function (item) {
                var promise = null;
                var result = fn(item);
                if (result === undefined) {
                    promise = mydbconn.cmd('lremindex', _this.item_list_key, _this.cursor_index);
                } else {
                    promise = mydbconn.cmd('lset', _this.item_list_key, _this.cursor_index, result);
                }

                return promise;
            });
        }
    }, {
        key: "prepare",
        value: function prepare() {
            var _this = this;

            _this.beacon.on('command:enter', function (options) {
                console.log("Command enter done on GALISTVIEW");
                var value = $("#ob-input").val();

                value = str_trim(value);

                if (startswith(value, "do:")) {
                    _this.run_command(value);
                } else if (startswith(value, "search:")) {
                    console.log("Don't know how to search yet. :(");
                } else if (value.length > 0) {
                    mydbconn.cmd('lpush', _this.item_list_key, { 'content': value });
                    omni_app.refresh();
                }

                $("#ob-input").val('');
                $("#ob-input").blur();
            });

            _this.beacon.on('control:select', function (options) {
                var target_index = options.index || _this.cursor_index;

                mydbconn.cmd('lindex', _this.item_list_key, target_index).then(function (obj) {
                    if (obj['selected']) {
                        obj['selected'] = false;
                    } else {
                        obj['selected'] = true;
                    }
                    mydbconn.cmd('lset', _this.item_list_key, target_index, obj).then(function (_v) {
                        omni_app.refresh();
                    });
                });
            });

            _this.beacon.on('control:deselect_all', function (options) {
                mydbconn.cmd('get', _this.item_list_key).then(function (str_value) {
                    var rows = JSON.parse(str_value.slice(1));

                    for (var i = 0; i < rows.length; i++) {
                        rows[i]['selected'] = false;
                    }
                    mydbconn.cmd('set', _this.item_list_key, "!" + JSON.stringify(rows)).then(function () {
                        omni_app.refresh();
                    });
                });
            });

            _this.beacon.on('control:select_all', function (options) {
                mydbconn.cmd('get', _this.item_list_key).then(function (str_value) {
                    var rows = JSON.parse(str_value.slice(1));

                    for (var i = 0; i < rows.length; i++) {
                        rows[i]['selected'] = true;
                    }
                    mydbconn.cmd('set', _this.item_list_key, "!" + JSON.stringify(rows)).then(function () {
                        omni_app.refresh();
                    });
                });
            });

            _this.beacon.on('control:move_up', function (options) {
                _this.cursor_index -= 1;
                if (_this.cursor_index < 0) {
                    _this.cursor_index = 0;
                }
                omni_app.refresh();
            });

            _this.beacon.on('control:move_up_more', function (options) {
                _this.cursor_index -= 10;
                if (_this.cursor_index < 0) {
                    _this.cursor_index = 0;
                }
                omni_app.refresh();
            });

            _this.beacon.on('control:move_top', function (options) {
                _this.cursor_index = 0;
                omni_app.refresh();
            });

            _this.beacon.on('control:move_down', function (options) {
                _this.cursor_index += 1;
                mydbconn.cmd('llen', _this.item_list_key).then(function (thelen) {
                    if (_this.cursor_index > thelen - 1) {
                        _this.cursor_index = thelen - 1;
                    }
                    omni_app.refresh();
                });
            });

            _this.beacon.on('control:move_down_more', function (options) {
                _this.cursor_index += 10;
                mydbconn.cmd('llen', _this.item_list_key).then(function (thelen) {
                    if (_this.cursor_index > thelen - 1) {
                        _this.cursor_index = thelen - 1;
                    }
                    omni_app.refresh();
                });
            });

            _this.beacon.on('control:move_bottom', function (options) {
                mydbconn.cmd('llen', _this.item_list_key).then(function (thelen) {
                    _this.cursor_index = thelen - 1;
                    omni_app.refresh();
                });
            });
        }
    }, {
        key: "render",
        value: function render(is_done) {
            var _this = this;
            var table = document.createElement('table');
            table.className = 'ob-table ob-reset';

            mydbconn.cmd('lrange', _this.item_list_key, 0, -1).then(function (data) {
                if (_this.cursor_index >= data.length) {
                    _this.cursor_index = data.length - 1;
                }

                if (data.length == 0) {
                    _this.cursor_index = 0;
                }

                for (var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    var d = document.createElement('tr');

                    if (_this.cursor_index == i) {
                        obj.active = true;
                        d.className = 'ob-tr active';
                    } else {
                        obj.active = false;
                        d.className = 'ob-tr';
                    }

                    obj.index = i;
                    d.innerHTML = omni_app.plugin_manager.default_transformer.parse(obj, this);
                    table.appendChild(d);
                }

                // Needs to be better.
                $("#ob-content").parent().animate({ 'scrollTop': 0 }, 10);

                is_done(table);
            });
        }
    }]);

    return OmniListController;
})(ViewController);