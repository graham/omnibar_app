class Controller {
    constructor(view) {
        this.view = view
        this.beacon = new Beacon();
    }

    render(is_done) {
        return this.view.render(this, is_done)
    }

    fire_event(etype, options) {
        return this.beacon.fire(etype, options)
    }
}

class ListController extends Controller {
    constructor() {
        super(new ListView())
        // Now some local stuff.
        this.item_list = [];
        for(var i = 0; i < 20; i++) {
            this.add_item("item " + i)
        }
        this.add_item("finish omnibox ;task ;important ;due")
        this.cursor_index = 0
    }

    fire_event(etype, options) {
        var sp = etype.split(':');

        if (sp[0] == 'command_focus') {
            this.map_focused((item) => {
                item.parse_mixins().forEach((mixin) => {
                    var m = glob_mixins[mixin]
                    if (m) {
                        (new m).on_event(sp[1], options, item)
                    }
                })
            }).then(function() {
                omni_app.refresh()
            })
            return true
        } else if (sp[0] == 'command_selected') {
            this.map_selected((item) => {
                item.parse_mixins().forEach((mixin) => {
                    var m = glob_mixins[mixin]
                    if (m) {
                        (new m).on_event(sp[1], options, item)
                    }
                })
            }).then(function() {
                omni_app.refresh();
            })
            return true
        } else {
            return this.beacon.fire(etype, options)
        }
    }

    get_selected() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var results = [];
            _this.item_list.forEach((item, index) => {
                if (item.selected == true) {
                    results.push(item);
                }
            });
            resolve(results);
        });
    }

    map_selected(fn) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var remaining_list = [];
            _this.item_list.forEach((item, index) => {
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
            })
            _this.item_list = remaining_list
            resolve([])
        })
    }
    
    get_focused() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            resolve(_this.item_list[_this.cursor_index]);
        });
    }
    
    map_focused(fn) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var remaining_list = [];
            _this.item_list.forEach((item, index) => {
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
            })
            _this.item_list = remaining_list
            resolve([])
        });
    }

    add_item(text) {
        var item = new Item(text);
        this.item_list = [item].concat(this.item_list);
    }

    prepare() {
        var _this = this;
        
        _this.beacon.on('command:enter', function(options) {
            var value = $("#ob-input").val();

            if (value.length == 0) {
                $("#ob-input").blur();
                return;
            }
            
            _this.add_item(value);
            omni_app.refresh();
            
            $("#ob-input").val('');
            $("#ob-input").blur();
        });

        _this.beacon.on('control:select', function(options) {
            var index = options.index || _this.cursor_index;
            var item = _this.item_list[index];

            if (item.selected == true) {
                item.selected = false;
            } else {
                item.selected = true;
            }
            omni_app.refresh();
        });

        _this.beacon.on('control:deselect_all', function(options) {
            _this.item_list.forEach((item) => {
                item.selected = false
            })
            omni_app.refresh();
        });

        _this.beacon.on('control:select_all', function(options) {
            _this.item_list.forEach((item) => {
                item.selected = true
            })
            omni_app.refresh();
        });

        _this.beacon.on('control:move_up', function(options) {
            _this.cursor_index -= 1;
            if (_this.cursor_index < 0) {
                _this.cursor_index = 0;
            }
            omni_app.refresh();
        });
        
        _this.beacon.on('control:move_up_more', function(options) {
            _this.cursor_index -= 10;
            if (_this.cursor_index < 0) {
                _this.cursor_index = 0;
            }
            omni_app.refresh();
        });

        _this.beacon.on('control:move_top', function(options) {
            _this.cursor_index = 0;
            omni_app.refresh();
        });

        _this.beacon.on('control:move_down', function(options) {
            _this.cursor_index += 1;
            omni_app.refresh();
        });

        _this.beacon.on('control:move_down_more', function(options) {
            _this.cursor_index += 10;
            omni_app.refresh();
        });
        
        _this.beacon.on('control:move_bottom', function(options) {
            _this.cursor_index = _this.item_list.length - 1
            omni_app.refresh();
        });

        _this.beacon.on('control:edit', function(options) {
            _this.map_focused(function(item) {
                $("#ob-input").val(item.text);
                $("#ob-input").focus();
                item.deleted = true
            }).then(function() {
                omni_app.refresh();
            });
        });
    }
}

