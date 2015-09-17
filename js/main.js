var MyView = ViewController.extend({
    render: function() {
	console.log("MyView rendering.");
	return "hello world";
    }
});

omni_app.ready(function(label, args) {
    var app = args[1];
    $("#ob-input").focus();

    omni_app.event_emitter.on('app:bar_updated', function() {
        console.log($("#ob-input").val());
    });

    omni_app.event_emitter.on('cmd:enter', function() {
        var value = $("#ob-input").val();

        omni_app_data.item_list.push({'content':value});
        omni_app.refresh();
        
        $("#ob-input").val('');
    });

    var stock_view = new GAListView();
    omni_app.push_view(stock_view);

    var custom_view = new MyView();
    omni_app.push_view(custom_view);
});
