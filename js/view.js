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

    prepare: function() {},
    destroy: function() {}
});

var GAListView = ViewController.extend({
    init: function() {
	// Call the superclass init with nothing.
	this._super();
	this.item_list = [];
	this.cursor_index = 0;
    },

    prepare: function() {
	var _this = this;
	_this.kap.add_passive_command('j', function() {
	    _this.cursor_index += 1;
	    omni_app.refresh();
	});
	_this.kap.add_passive_command('k', function() {
	    _this.cursor_index -= 1;
	    omni_app.refresh();
	});
    },

    render: function() {
	var _this = this;

	console.log("GAListView rendering.");

        var table = document.createElement('table');
        table.className = 'ob-table ob-reset';

        for(var i=0; i < omni_app_data.item_list.length; i++) {
            var obj = omni_app_data.item_list[i];
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
