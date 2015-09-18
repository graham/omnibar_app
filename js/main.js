var str_trim = function(s) { 
    return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, "");
};

var MyView = ViewController.extend({

    prepare: function() {
	console.log('prepare myview');
	var kap = omni_app.kap.get_current_handler();
	kap.add_passive_command('p', function() {
	    omni_app.pop_view();
	});
    },

    render: function() {
	console.log("MyView rendering.");
	return "hello world: " + (new Date());
    },

    destroy: function() {
	
    }

});

omni_app.ready(function(label, args) {
    var app = args[1];
    $("#ob-input").focus();

    omni_app.event_emitter.on('app:bar_updated', function() {
        console.log($("#ob-input").val());
    });

    omni_app.event_emitter.on('cmd:enter', function(_event, arg) {
        var value = $("#ob-input").val();
	var mod = arg[1];

	if (str_trim(value).length > 0) {
	    omni_app_data.item_list = [{'content':value}].concat(omni_app_data.item_list);
            omni_app.refresh();
        }

        $("#ob-input").val('');
	if (mod == 'shift') {
	    // pass, allow person to keep adding things.
	} else {
	    $("#ob-input").blur();
	}
    });

    var stock_view = new GAListView();
    omni_app.push_view(stock_view);

    var custom_view = new MyView();
    omni_app.push_view(custom_view);
});
