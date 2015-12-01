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
        this.cursor_index = 0
        this.sort_styles = ['star', 'type', 'text', 'select']
        this.sort_style_index = 0
        this.current_edit = null
    }

    add_item(item) {
        this.item_list = [item].concat(this.item_list)
    }

    fire_event(etype, options) {
        var sp = etype.split(':');
        if (sp[0] == 'command_focus') {
            this.map_focused((item) => {
                item.on_event(sp[1], options, item)
            }).then(function() {
                omni_app.refresh()
            })
            return true
        } else if (sp[0] == 'command_selected') {
            this.map_selected((item) => {
                item.on_event(sp[1], options, item)
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
                    if (item.archived == true) {
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

                    console.log(item)
                    
                    if (item.archived == true) {
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

    execute_command(value) {
        var sp = value.split(":");
        if (sp.length == 1) {
            sp = ['sel', value]
        }
        if (sp[0] == 'sel') {
            this.map_selected((item) => {
                var values = sp[1].split(' ')
                item.on_event(values[0], sp[1], item)
            }).then(function() {
                omni_app.refresh();
            })
        }
    }

    sort() {
        var _this = this
        var sort_style = _this.sort_styles[_this.sort_style_index]
        console.log(sort_style)
        
        if (sort_style == 'text') {
            _this.item_list.sort((a, b) => {
                var left = a.as_line()
                var right = b.as_line()
                if (left < right)
                    return -1;
                if (left > right)
                    return 1;
                return 0;
            })
        } else if (sort_style == 'star') {
            _this.item_list.sort((a, b) => {
                var left = a.get_meta('flagged')
                var right = b.get_meta('flagged')
                if (left)
                    return -1;
                if (right)
                    return 1;
                return 0;
            })
        } else if (sort_style == 'type') {
            _this.item_list.sort((a, b) => {
                var left = a.parse()['roles'][0].toLowerCase()
                var right = b.parse()['roles'][0].toLowerCase()
                if (left < right)
                    return -1
                if (left > right)
                    return 1
                return 0
            })
        } else if (sort_style == 'select') {
            _this.item_list.sort((a, b) => {
                var left = a.selected
                var right = b.selected
                if (left)
                    return -1;
                if (right)
                    return 1;
                return 0;
            })
        }
    }

    get_item(id) {
        var hit = null
        this.item_list.forItem((item) => {
            if (item.uid == id) {
                hit = item
            }
        })
        return hit
    }

    prepare() {
        var _this = this;

        var enter_fn = function(options) {
            var value = $("#ob-input").val();

            if (value.length == 0) {
                $("#ob-input").blur();
                return;
            }

            if (startswith(value, '!')) {
                _this.execute_command(value.slice(1))
            } else {
                let item = null
                if (_this.current_edit) {
                    item = _this.current_edit
                    _this.current_edit = null
                    item.text = value
                    item.on_event('update', {})
                } else {
                    item = Item.from_text(value)
                    item.on_event('create', {})
                    _this.add_item(item)
                }
            }

            omni_app.refresh();

            $("#ob-input").val('');
            $("#ob-input").blur();
        }

        _this.beacon.on('command:enter', enter_fn)

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

        _this.beacon.on('control:select_only', function(options) {
            var index = options.index || _this.cursor_index;
            _this.item_list.forEach((item, _index) => {
                if (index == _index) {
                    item.selected = true
                } else {
                    item.selected = false
                }
            })
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
                _this.current_edit = item
                $("#ob-input").val(item.text);
                $("#ob-input").focus();
            }).then(function() {
                omni_app.refresh();
            });
        });

        _this.beacon.on('control:full_edit', function(options) {
            _this.map_focused(function(item) {
                let editor = null
                let roles = item.parse()['roles']
                
                $("#memo_inner_container").html("<textarea id='memo_editor'></textarea>")
                editor = CodeMirror.fromTextArea(document.getElementById('memo_editor'), {
                    indentUnit: 4,
                    lineWrapping: true,
                    extraKeys: {
                        "Tab": function(cm) {
                            console.log("TAB");
                        },
                        "Shift-Tab":function(cm) {
                            console.log("shift-tab");
                        },
                        "Shift-Enter":function(cm) {
                            editor.getValue().split('\n').forEach((line) => {
                                line = str_trim(line)
                                if (line.length) {
                                    let newitem = Item.from_text(line + ' ' + roles.join(' '))
                                    newitem.on_event('create', {})
                                    _this.add_item(newitem)
                                }
                            })

                            item.text += ' $archive'
                            item.on_event('update', {})
                            
                            $("#memo_editor_container").hide()
                            $("#ob-input").focus()
                            $("#ob-input").blur()
                            omni_app.refresh()
                        }
                    }
                });

                editor.setValue(item.text)
                $("#memo_editor_container").show()

                setTimeout(() => {
                    editor.focus()
                    editor.refresh()
                }, 10)
                item.archived = true
            }).then(function() {
                omni_app.refresh();
            });
        });

        _this.beacon.on('control:cycle_sort', function(options) {
            _this.sort_style_index += 1
            _this.sort_style_index %= _this.sort_styles.length
            _this.sort()
            omni_app.refresh()
        });

        _this.beacon.on('control:re_sort', function(options) {
            _this.sort()
            omni_app.refresh()
        });

        _this.beacon.on('app:bar_updated', function(options) {
            //console.log('boop:', options)
        })
    }
}
