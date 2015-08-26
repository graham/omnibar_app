omni_app.ready(function(label, args) {
    var app = args[1];
    $("#ob-input").focus();

    omni_app.event_emitter.on('app.bar_updated', function() {
        console.log($("#ob-input").val());
    });

    omni_app.event_emitter.on('cmd.enter', function() {
        var value = $("#ob-input").val();

        omni_app_data.item_list.push({'content':value});
        omni_app.refresh();
        
        $("#ob-input").val('');
    });
});
