var View = Class.extend({});

var Controller = Class.extend({});

var ViewController = Class.extend({
    init: function() {
        this.beacon = new Beacon();
        console.log('init inside view.');
    },

    render: function() {
        console.log("Core View rendering.");
        var d = document.createElement('div')
        d.innerHTML = "Someone didn't implement the render method on their view. :(";
        return d;
    },

    prepare: function() {
        console.log("Prepare basic ViewController.");
    },

    destroy: function() {
        console.log("Destroy basic ViewController.");
    },

    will_hide_view: function() {},
    will_show_view: function() {},
    did_hide_view: function() {},
    did_show_view: function() {}
});

var OmniListController = ViewController.extend({
    init: function() {
        // Call the superclass init with nothing.
        this._super();
        
        // Now some local stuff.
        this.item_list_key = 'wndrfl_list_items';
        this.cursor_index = 0;
    },
    
    run_command: function(value) {
        var _this = this;
        if (value == 'do:value') {
            for(var i=0; i < 10; i++) {
                mydbconn.cmd('rpush', _this.item_list_key, {'content':'a word '+i});
            }
            this.cursor_index = 0;
            setTimeout(function() {
                omni_app.refresh();
            }, 10);
        }
    },

    get_selected: function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var return_values = [];
            mydbconn.cmd('lrange', _this.item_list_key, 0, -1).then(function(data) {
                for(var i=0; i < data.length; i++) {
                    var obj = data[i];
                    obj.index = i;

                    if (obj['selected'] == true) {
                        return_values.push(obj);
                    }
                }
                resolve(return_values);
            });
        });
    },

    map_selected: function(fn) {
        var _this = this;
        return _this.get_selected().then(function(values) {
            var last_promise = null;
            var indexs_to_remove = [];
            var ps = [];
            
            for(var i=0; i < values.length; i++) {
                (function(index, item) {
                    var result = fn(item);
                    if (result) {
                        mydbconn.cmd('lset', _this.item_list_key, item.index, result);
                    } else {
                        indexs_to_remove.push(item.index);
                    }
                })(i, values[i]);
            }

            for(var i=indexs_to_remove.length-1; i >= 0; i--) {
                (function(index, item) {
                    ps.push(mydbconn.cmd('lrem', _this.item_list_key, item));
                })(i, indexs_to_remove[i]);
            }
            
            return mydbconn.all(ps);
        });
    },

    get_focused: function() {
        var _this = this;
        return mydbconn.cmd('lindex', _this.item_list_key, _this.cursor_index);
    },

    prepare: function() {
        var _this = this;
        
        _this.beacon.on('command:enter', function(options) {
            console.log("Command enter done on GALISTVIEW");
            var value = $("#ob-input").val();

            value = str_trim(value);

            if (startswith(value, "do:")) {
                _this.run_command(value);
            } else if (startswith(value, "search:")) {
                console.log("Don't know how to search yet. :(");
            } else if (value.length > 0) {
                mydbconn.cmd('lpush', _this.item_list_key, {'content':value})
                omni_app.refresh();
            }

            $("#ob-input").val('');
            $("#ob-input").blur();
        });

        _this.beacon.on('control:select', function(options) {
            var target_index = options.index || _this.cursor_index;
            
            mydbconn.cmd('lindex', _this.item_list_key, target_index).then(function(obj) {
                if (obj['selected']) {
                    obj['selected'] = false;
                } else {
                    obj['selected'] = true;
                }
                mydbconn.cmd('lset', _this.item_list_key, target_index, obj).then(function(_v) {
                    omni_app.refresh();
                });
            });
        });
        
        _this.beacon.on('control:deselect_all', function(options) {
            mydbconn.cmd('get', _this.item_list_key).then(function(str_value) {
                var rows = JSON.parse(str_value.slice(1));

                for(var i=0; i < rows.length; i++) {
                    rows[i]['selected'] = false;
                }
                mydbconn.cmd('set', _this.item_list_key, "!" + JSON.stringify(rows)).then(function() {
                    omni_app.refresh();
                });
            });
        });

        _this.beacon.on('control:select_all', function(options) {
            mydbconn.cmd('get', _this.item_list_key).then(function(str_value) {
                var rows = JSON.parse(str_value.slice(1));

                for(var i=0; i < rows.length; i++) {
                    rows[i]['selected'] = true;
                }
                mydbconn.cmd('set', _this.item_list_key, "!" + JSON.stringify(rows)).then(function() {
                    omni_app.refresh();
                });
            });
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
            mydbconn.cmd('llen', _this.item_list_key).then(function(thelen) {
                if (_this.cursor_index > (thelen-1)) {
                    _this.cursor_index = thelen-1;
                }
                omni_app.refresh();
            });
        });

        _this.beacon.on('control:move_down_more', function(options) {
            _this.cursor_index += 10;
            mydbconn.cmd('llen', _this.item_list_key).then(function(thelen) {
                if (_this.cursor_index > (thelen-1)) {
                    _this.cursor_index = thelen-1;
                }
                omni_app.refresh();
            });
        });
        
        _this.beacon.on('control:move_bottom', function(options) {
            mydbconn.cmd('llen', _this.item_list_key).then(function(thelen) {
                _this.cursor_index = thelen-1;
                omni_app.refresh();
            });
        });
    },
    
    render: function(done) {
        var _this = this;
        var table = document.createElement('table');
        table.className = 'ob-table ob-reset';

        mydbconn.cmd('lrange', _this.item_list_key, 0, -1).then(function(data) {
            if (_this.cursor_index >= data.length) {
                _this.cursor_index = data.length-1;
            }
            
            for(var i=0; i < data.length; i++) {
                var obj = data[i];
                var d = document.createElement('tr');
                
                if (_this.cursor_index == i) {
                    obj.active = true;
                } else {
                    obj.active = false;
                }

                obj.index = i;

                d.className = 'ob-tr';
                d.innerHTML = omni_app.env.render('line_item', obj);
                table.appendChild(d);
            }

            done(table);
        });
    }
});
