var mydbconn = jsredis.connect('local');

var MyView = ViewController.extend({
    prepare: function() {
        console.log('prepare myview');
        this.beacon.once("command:close", function() {
            console.log("cmd close;");
            omni_app.pop_view();
        });
        
        this.beacon.on('time:update', function(options) {
            console.log("update: " + JSON.stringify(options));
            omni_app.refresh();
        });
    },
    
    render: function() {
        console.log("MyView rendering.");
        return "hello world: " + (new Date());
    }
    
});

var GAListView = ViewController.extend({
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
                mydbconn.cmd('rpush', _this.item_list_key, JSON.stringify({'content':'a word '+i}));
            }
            this.cursor_index = 0;
            setTimeout(function() {
                omni_app.refresh();
            }, 10);
        }
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
                mydbconn.cmd('lpush', _this.item_list_key, JSON.stringify({'content':value}))
                omni_app.refresh();
            }
            
            $("#ob-input").val('');
            $("#ob-input").blur();
        });

        _this.beacon.on('control:select', function(options) {
            console.log("SELECT");
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
        
        console.log("GAListView rendering.");
        
        var table = document.createElement('table');
        table.className = 'ob-table ob-reset';

        mydbconn.cmd('lrange', _this.item_list_key, 0, -1).then(function(data) {
            for(var i=0; i < data.length; i++) {
                var obj = JSON.parse(data[i]);
                var d = document.createElement('tr');
                
                if (_this.cursor_index == i) {
                    obj.active = true;
                } else {
                    obj.active = false;
                }
                
                d.className = 'ob-tr';
                d.innerHTML = omni_app.env.render('line_item', obj);
                table.appendChild(d);
            }
            done(table);
        });
    }
});

// Our App Code.

omni_app.ready(function(label, args) {
    $("#ob-input").focus();
    
    omni_app.event_emitter.on('app:bar_updated', function() {
        console.log($("#ob-input").val());
    });
    
    omni_app.event_emitter.on('special:one', function() {
        var custom_view = new MyView();
        omni_app.push_view(custom_view);
    });
    
    omni_app.event_emitter.on('special:two', function() {
        omni_app.fire_event('command:close', {});
    });

    omni_app.event_emitter.on('command:cancel', function() {
        $("#ob-input").val('');
        $("#ob-input").blur();
    });
    
    omni_app.event_emitter.on('command:search', function() {
        $("#ob-input").val('search:');
        $("#ob-input").focus();
    });

    omni_app.event_emitter.on('command:go', function() {
        $("#ob-input").val('go:');
        $("#ob-input").focus();
    });
    
    omni_app.event_emitter.on('command:filter', function() {
        $("#ob-input").val('filter:');
        $("#ob-input").focus();
    });

    omni_app.event_emitter.on('command:do', function() {
        $("#ob-input").val('do:');
        $("#ob-input").focus();
    });

    omni_app.event_emitter.on('command:before', function() {
        $("#ob-input").val('before:');
        $("#ob-input").focus();
    });

    omni_app.event_emitter.on('command:after', function() {
        $("#ob-input").val('after:');
        $("#ob-input").focus();
    });

    var stock_view = new GAListView();
    omni_app.push_view(stock_view);
});
