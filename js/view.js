var startswith = function(s, prefix) {
    if (s.slice(0, prefix.length) == prefix) {
	return true;
    } else {
	return false;
    }
};

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

var GAListView = ViewController.extend({
    init: function() {
	// Call the superclass init with nothing.
	this._super();

	// Now some local stuff.
	this.item_list = [];
	this.cursor_index = 0;

	for(var i=0; i < 10; i++) {
	    this.item_list.push({'content':'a word '+i});
	}
    },

    run_command: function(value) {
	var _this = this;
	if (value == 'do:value') {
	    for(var i=0; i < 10; i++) {
		_this.item_list.push({'content':'a word '+i});
	    }
	    this.cursor_index = 0;
	    omni_app.refresh();
	}
    },

    prepare: function() {
	var _this = this;

	_this.beacon.on('cmd:enter', function(options) {
	    console.log("Command enter done on GALISTVIEW");
            var value = $("#ob-input").val();

	    value = str_trim(value);

	    if (startswith(value, "do:")) {
		_this.run_command(value);
	    } else if (startswith(value, "search:")) {
		console.log("Don't know how to search yet. :(");
	    } else if (value.length > 0) {
		_this.item_list = [{'content':value}].concat(_this.item_list);
		omni_app.refresh();
            }
	    
            $("#ob-input").val('');
	    $("#ob-input").blur();
	});

	_this.beacon.on('control:move_up', function(options) {
	    _this.cursor_index -= 1;
	    if (_this.cursor_index < 0) {
		_this.cursor_index = 0;
	    }
	    omni_app.refresh();
	});

	_this.beacon.on('control:move_down', function(options) {
	    _this.cursor_index += 1;
	    if (_this.cursor_index > (_this.item_list.length-1)) {
		_this.cursor_index = _this.item_list.length-1;
	    }
	    omni_app.refresh();
	});
    },

    render: function() {
	var _this = this;

	console.log("GAListView rendering.");

        var table = document.createElement('table');
        table.className = 'ob-table ob-reset';

        for(var i=0; i < _this.item_list.length; i++) {
            var obj = _this.item_list[i];
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
	return table;
    }
});
