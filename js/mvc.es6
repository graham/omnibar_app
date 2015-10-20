class View {
    constructor() {}
    render() {
        return "hello world"
    }
}

class Controller {

}

class Source {}

class Item {}

class ViewController extends View {
    contructor() {
        this.beacon = new Beacon();
        console.log('init inside view.');
    }

    render() {
        console.log("Core View rendering.");
        var d = document.createElement('div')
        d.innerHTML = "Someone didn't implement the render method on their view. :(";
        return d;
    }

    prepare() {
        console.log("Prepare basic ViewController.");
    }

    destroy() {
        console.log("Destroy basic ViewController.");
    }
}

class OmniListController extends ViewController {
    constructor() {
        // Call the superclass init with nothing.
        super();
        
        // Now some local stuff.
        this.item_list_key = 'wndrfl_list_items';
        this.cursor_index = 0;
        this.beacon = new Beacon();
    }
    
    run_command(value) {
        var _this = this;
        var last_command = null;
        if (value == 'do:value') {
            for(var i=0; i < 10; i++) {
                last_command = mydbconn.cmd('rpush', _this.item_list_key, {'content':'a word '+i});
            }
            this.cursor_index = 0;
            if (last_command) {
                last_command.then(function() {
                    omni_app.refresh();
                });
            } else {
                setTimeout(function() {
                    omni_app.refresh();
                }, 0);
            }
        }
    }

    get_selected() {
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
    }

    map_selected(fn) {
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
                    ps.push(mydbconn.cmd('lremindex', _this.item_list_key, item));
                })(i, indexs_to_remove[i]);
            }
            
            return mydbconn.all(ps);
        });
    }

    get_focused() {
        var _this = this;
        return mydbconn.cmd('lindex', _this.item_list_key, _this.cursor_index);
    }

    map_focused(fn) {
        var _this = this;
        return _this.get_focused().then(function(item) {
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

    prepare() {
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
    }
    
    render(is_done) {
        var _this = this;
        var table = document.createElement('table');
        var did = null;
        table.className = 'ob-table ob-reset';

        mydbconn.cmd('lrange', _this.item_list_key, 0, -1).then(function(data) {
            if (_this.cursor_index >= data.length) {
                _this.cursor_index = data.length-1;
            }

            if (data.length == 0) {
                _this.cursor_index = 0;
            }
            
            for(var i=0; i < data.length; i++) {
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
                d.innerHTML = omni_app.env.render('line_item', obj);
                table.appendChild(d);

                did = d;
            }

            // Needs to be better.
            $("#ob-content").parent().animate({'scrollTop':0}, 10);
            
            is_done(table);
        });
    }
}
