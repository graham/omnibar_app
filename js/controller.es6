class Controller {
    constructor(view) {
        this.view = view
        this.beacon = new Beacon();
    }
    render(is_done) {
        return this.view.render(this, is_done)
    }
}

class ListController extends Controller {
    constructor() {
        super(new ListView());
        
        // Now some local stuff.
        this.item_list = [];
        this.cursor_index = 0;
    }
    
    get_selected() {
        var results = [];
        this.item_list.forEach((item, index) => {
            if (item.selected == true) {
                results.push(item);
            }
        });
        return results;
    }
    
    map_selected(fn) {
        var remaining_list = [];
        
        this.item_list.forEach((item, index) => {
            if (item.selected) {
                var result = true;
            
                try {
                    result = fn(item);
                } catch (e) {
                    alert(e);
                }
                
                if (result == false) {
                    // pass we are discarding.
                } else {
                    remaining_list.push(item);
                }
            } else {
                remaining_list.push(item);
            }
        });

        this.item_list = remaining_list;
    }
    
    get_focused() { return this.item_list[this.cursor_index]; }

    map_focused(fn) {
        var result = true;
        var item = this.get_focused();
        
        try {
            result = fn(item);
        } catch(e) {
            alert(e);
        }

        if (result == false) {
            // do nothing.
        } else {
            this.item_list = this.item_list.slice(0, this.cursor_index) +
                this.item_list.slice(this.cursor_index+1, this.item_list.length+1);
        }
    }

    prepare() {
        var _this = this;
        
        _this.beacon.on('command:enter', function(options) {
            var value = $("#ob-input").val();

            if (value.length == 0) {
                $("#ob-input").blur();
                return;
            }
            
            _this.item_list.push({'content':value});
            console.log("value: " + value);
            omni_app.refresh();
            
            $("#ob-input").val('');
            $("#ob-input").blur();
        });

        _this.beacon.on('control:select', function(options) {
            
        });

        _this.beacon.on('command_single:toggle_star', function(options) {
        });

        
        _this.beacon.on('control:deselect_all', function(options) {
        });

        _this.beacon.on('control:select_all', function(options) {
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
        });

        _this.beacon.on('control:move_down_more', function(options) {
            _this.cursor_index += 10;
        });
        
        _this.beacon.on('control:move_bottom', function(options) {
        });

        _this.beacon.on('command_multi:archive', function(options) {
            _this.map_selected(function(item) {
                return false;
            }).then(function() {
                omni_app.refresh();
            });
        });

        _this.beacon.on('command_multi:info', function(options) {
            _this.map_selected(function(item) {
                console.log(JSON.stringify(item));
                return false;
            }).then(function() {
                omni_app.refresh();
            });
        });

        _this.beacon.on('command_multi:right', function(options) {
            _this.map_selected(function(item) {
                item.content = '.' + item.content;
            }).then(function() {
                omni_app.refresh();
            });
        });

        _this.beacon.on('command_multi:left', function(options) {
            _this.map_selected(function(item) {
                if (item.content[0] == '.') {
                    item.content = item.content.slice(1);
                }
            }).then(function() {
                omni_app.refresh();
            });
        });

        _this.beacon.on('command_single:edit', function(options) {
            _this.map_focused(function(item) {
                $("#ob-input").val(item.content);
                $("#ob-input").focus();
                return false;
            }).then(function() {
                omni_app.refresh();
            });
        });
        
    }
}

