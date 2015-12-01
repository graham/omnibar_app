'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Controller = (function () {
    function Controller(view) {
        _classCallCheck(this, Controller);

        this.view = view;
        this.beacon = new Beacon();
    }

    _createClass(Controller, [{
        key: 'render',
        value: function render(is_done) {
            return this.view.render(this, is_done);
        }
    }, {
        key: 'fire_event',
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

        _get(Object.getPrototypeOf(ListController.prototype), 'constructor', this).call(this, new ListView());
        // Now some local stuff.
        this.item_list = [];
        this.cursor_index = 0;
        this.sort_styles = ['star', 'type', 'text', 'select'];
        this.sort_style_index = 0;
        this.current_edit = null;
    }

    _createClass(ListController, [{
        key: 'add_item',
        value: function add_item(item) {
            this.item_list = [item].concat(this.item_list);
        }
    }, {
        key: 'fire_event',
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
        key: 'get_selected',
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
        key: 'map_selected',
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
                        if (item.archived == true) {
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
        key: 'get_focused',
        value: function get_focused() {
            var _this = this;
            return new Promise(function (resolve, reject) {
                resolve(_this.item_list[_this.cursor_index]);
            });
        }
    }, {
        key: 'map_focused',
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
                        if (item.archived == true) {
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
        key: 'execute_command',
        value: function execute_command(value) {
            var sp = value.split(":");
            if (sp.length == 1) {
                sp = ['sel', value];
            }
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
        key: 'sort',
        value: function sort() {
            var _this = this;
            var sort_style = _this.sort_styles[_this.sort_style_index];
            console.log(sort_style);

            if (sort_style == 'text') {
                _this.item_list.sort(function (a, b) {
                    var left = a.parse()['body'];
                    var right = b.parse()['body'];
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
                    var left = a.parse()['mixins'][0].toLowerCase();
                    var right = b.parse()['mixins'][0].toLowerCase();
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
        key: 'get_item',
        value: function get_item(id) {
            var hit = null;
            this.item_list.forItem(function (item) {
                if (item.uid == id) {
                    hit = item;
                }
            });
            return hit;
        }
    }, {
        key: 'prepare',
        value: function prepare() {
            var _this = this;

            var enter_fn = function enter_fn(options) {
                var value = $("#ob-input").val();

                if (value.length == 0) {
                    $("#ob-input").blur();
                    return;
                }

                if (startswith(value, '!')) {
                    _this.execute_command(value.slice(1));
                } else {
                    var item = null;
                    if (_this.current_edit) {
                        item = _this.current_edit;
                        _this.current_edit = null;
                        item.text = value;
                        item.on_event('update', {});
                    } else {
                        item = new Item(value);
                        item.uid = uuid();
                        item.on_event('create', {});
                    }
                    _this.add_item(item);
                }
                omni_app.refresh();

                $("#ob-input").val('');
                $("#ob-input").blur();
            };

            _this.beacon.on('command:enter', enter_fn);

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

            _this.beacon.on('control:select_only', function (options) {
                var index = options.index || _this.cursor_index;
                _this.item_list.forEach(function (item, _index) {
                    if (index == _index) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                });
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
                    _this.current_edit = item;
                    $("#ob-input").val(item.text);
                    $("#ob-input").focus();
                    item.archived = true;
                }).then(function () {
                    omni_app.refresh();
                });
            });

            _this.beacon.on('control:full_edit', function (options) {
                _this.map_focused(function (item) {
                    var editor = null;
                    var mixins = [];

                    item.parse()['mixins'].forEach(function (mixin) {
                        if (mixin != 'BaseMixin') {
                            mixins.push(';' + mixin);
                        }
                    });

                    $("#memo_inner_container").html("<textarea id='memo_editor'></textarea>");
                    editor = CodeMirror.fromTextArea(document.getElementById('memo_editor'), {
                        indentUnit: 4,
                        lineWrapping: true,
                        extraKeys: {
                            "Tab": function Tab(cm) {
                                console.log("TAB");
                            },
                            "Shift-Tab": function ShiftTab(cm) {
                                console.log("shift-tab");
                            },
                            "Shift-Enter": function ShiftEnter(cm) {
                                editor.getValue().split('\n').forEach(function (line) {
                                    line = str_trim(line);
                                    if (line.length) {
                                        var newitem = new Item(line + ' ' + mixins.join(' '));
                                        newitem.uid = uuid();
                                        newitem.on_event('create', {});
                                        _this.add_item(newitem);
                                    }
                                });

                                item.text += ' $archive';
                                item.on_event('update', {});

                                $("#memo_editor_container").hide();
                                $("#ob-input").focus();
                                $("#ob-input").blur();
                                omni_app.refresh();
                            }
                        }
                    });

                    editor.setValue(item.text);
                    $("#memo_editor_container").show();

                    setTimeout(function () {
                        editor.focus();
                        editor.refresh();
                    }, 10);
                    item.archived = true;
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

            _this.beacon.on('app:bar_updated', function (options) {
                //console.log('boop:', options)
            });
        }
    }]);

    return ListController;
})(Controller);