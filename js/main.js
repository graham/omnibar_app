var str_trim = function(s) { 
    return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, "");
};

var MyView = ViewController.extend({
    prepare: function() {
	console.log('prepare myview');
	this.beacon.once("cmd:close", function() {
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

omni_app.ready(function(label, args) {
    $("#ob-input").focus();

    omni_app.event_emitter.on('app:bar_updated', function() {
        console.log($("#ob-input").val());
    });

    var stock_view = new GAListView();
    omni_app.push_view(stock_view);

    var custom_view = new MyView();
    omni_app.push_view(custom_view);
});
