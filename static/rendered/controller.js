"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = (function () {
    function Controller(view) {
        _classCallCheck(this, Controller);

        this.view = view;
        this.beacon = new Beacon();
    }

    _createClass(Controller, [{
        key: "render",
        value: function render(is_done) {
            return this.view.render(this, is_done);
        }
    }, {
        key: "fire_event",
        value: function fire_event(etype, options) {
            return this.beacon.fire(etype, options);
        }
    }]);

    return Controller;
})();

var ListController = (function (_Controller) {
    _inherits(ListController, _Controller);

    function ListController() {
        _classCallCheck(this, ListController);

        _get(Object.getPrototypeOf(ListController.prototype), "constructor", this).call(this, new ListView());
        // Now some local stuff.
        this.item_list = [];
        for (var i = 0; i < 20; i++) {
            if (i % 4 == 0) {
                this.add_item("item " + i + " #" + randword());
            } else if (i % 4 == 1) {
                this.add_item("item " + i + " ;asdf");
            } else if (i % 4 == 2) {
                this.add_item("item " + i + " ;" + randword());
            } else {
                this.add_item("item " + i + " +project");
            }
        }
        this.add_item("finish omnibox ;task ;important ;due");
        this.cursor_index = 0;

        this.sort_styles = ['star', 'type', 'text', 'select'];
        this.sort_style_index = 0;
    }

    _createClass(ListController, [{
        key: "fire_event",
        value: function fire_event(etype, options) {
            var sp = etype.split(':');

            if (sp[0] == 'command_focus') {
                this.map_focused(function (item) {
                    item.on_event(sp[1], options, item);
                }).then(function () {
                    omni_app.refresh();
                });
                return true;
            } else if (sp[0] == 'command_selected') {
                this.map_selected(function (item) {
                    item.on_event(sp[1], options, item);
                }).then(function () {
                    omni_app.refresh();
                });
                return true;
            } else {
                return this.beacon.fire(etype, options);
            }
        }
    }, {
        key: "get_selected",
        value: function get_selected() {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var results = [];
                _this.item_list.forEach(function (item, index) {
                    if (item.selected == true) {
                        results.push(item);
                    }
                });
                resolve(results);
            });
        }
    }, {
        key: "map_selected",
        value: function map_selected(fn) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var remaining_list = [];
                _this.item_list.forEach(function (item, index) {
                    if (item.selected) {
                        var result = true;

                        try {
                            result = fn(item);
                        } catch (e) {
                            console.log(e);
                            reject();
                        }

                        if (item.deleted == true) {
                            // pass we are discarding.
                        } else {
                                remaining_list.push(item);
                            }
                    } else {
                        remaining_list.push(item);
                    }
                });
                _this.item_list = remaining_list;
                resolve([]);
            });
        }
    }, {
        key: "get_focused",
        value: function get_focused() {
            var _this = this;
            return new Promise(function (resolve, reject) {
                resolve(_this.item_list[_this.cursor_index]);
            });
        }
    }, {
        key: "map_focused",
        value: function map_focused(fn) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var remaining_list = [];
                _this.item_list.forEach(function (item, index) {
                    if (index == _this.cursor_index) {
                        var result = true;

                        try {
                            result = fn(item);
                        } catch (e) {
                            console.log(e);
                            reject();
                        }

                        if (item.deleted == true) {
                            // pass we are discarding.
                        } else {
                                remaining_list.push(item);
                            }
                    } else {
                        remaining_list.push(item);
                    }
                });
                _this.item_list = remaining_list;
                resolve([]);
            });
        }
    }, {
        key: "add_item",
        value: function add_item(text) {
            var item = new Item(text);
            this.item_list = [item].concat(this.item_list);
        }
    }, {
        key: "execute_command",
        value: function execute_command(value) {
            var sp = value.split(":");
            if (sp[0] == 'sel') {
                this.map_selected(function (item) {
                    var values = sp[1].split(' ');
                    item.on_event(values[0], sp[1], item);
                }).then(function () {
                    omni_app.refresh();
                });
            }
        }
    }, {
        key: "execute_search",
        value: function execute_search(value) {
            // push a view controller on with search results.
        }
    }, {
        key: "sort",
        value: function sort() {
            var _this = this;
            var sort_style = _this.sort_styles[_this.sort_style_index];
            console.log(sort_style);

            if (sort_style == 'text') {
                _this.item_list.sort(function (a, b) {
                    var left = a.as_line();
                    var right = b.as_line();
                    if (left < right) return -1;
                    if (left > right) return 1;
                    return 0;
                });
            } else if (sort_style == 'star') {
                _this.item_list.sort(function (a, b) {
                    var left = a.starred;
                    var right = b.starred;
                    if (left) return -1;
                    if (right) return 1;
                    return 0;
                });
            } else if (sort_style == 'type') {
                _this.item_list.sort(function (a, b) {
                    var left = a.parse_mixins()[0].toLowerCase();
                    var right = b.parse_mixins()[0].toLowerCase();
                    if (left == 'basemixin') {
                        return 1;
                    }
                    if (right == 'basemixin') {
                        return -1;
                    }
                    if (left < right) return -1;
                    if (left > right) return 1;
                    return 0;
                });
            } else if (sort_style == 'select') {
                _this.item_list.sort(function (a, b) {
                    var left = a.selected;
                    var right = b.selected;
                    if (left) return -1;
                    if (right) return 1;
                    return 0;
                });
            }
        }
    }, {
        key: "prepare",
        value: function prepare() {
            var _this = this;

            _this.beacon.on('command:enter', function (options) {
                var value = $("#ob-input").val();

                if (value.length == 0) {
                    $("#ob-input").blur();
                    return;
                }

                if (startswith(value, '!')) {
                    _this.execute_command(value.slice(1));
                } else if (startswith(value, '?')) {
                    _this.execute_search(value.slice(1));
                } else {
                    _this.add_item(value);
                }
                omni_app.refresh();

                $("#ob-input").val('');
                $("#ob-input").blur();
            });

            _this.beacon.on('control:select', function (options) {
                var index = options.index || _this.cursor_index;
                var item = _this.item_list[index];

                if (item.selected == true) {
                    item.selected = false;
                } else {
                    item.selected = true;
                }
                omni_app.refresh();
            });

            _this.beacon.on('control:deselect_all', function (options) {
                _this.item_list.forEach(function (item) {
                    item.selected = false;
                });
                omni_app.refresh();
            });

            _this.beacon.on('control:select_all', function (options) {
                _this.item_list.forEach(function (item) {
                    item.selected = true;
                });
                omni_app.refresh();
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
                omni_app.refresh();
            });

            _this.beacon.on('control:move_down_more', function (options) {
                _this.cursor_index += 10;
                omni_app.refresh();
            });

            _this.beacon.on('control:move_bottom', function (options) {
                _this.cursor_index = _this.item_list.length - 1;
                omni_app.refresh();
            });

            _this.beacon.on('control:edit', function (options) {
                _this.map_focused(function (item) {
                    $("#ob-input").val(item.text);
                    $("#ob-input").focus();
                    item.deleted = true;
                }).then(function () {
                    omni_app.refresh();
                });
            });

            _this.beacon.on('control:cycle_sort', function (options) {
                _this.sort_style_index += 1;
                _this.sort_style_index %= _this.sort_styles.length;
                _this.sort();
                omni_app.refresh();
            });

            _this.beacon.on('control:re_sort', function (options) {
                _this.sort();
                omni_app.refresh();
            });
        }
    }]);

    return ListController;
})(Controller);