// TODO refactor this into something reasonable.
$(document).ready(function() {
    var hostname = window.location.hostname;
    if (hostname == 'localhost' || hostname == '127.0.0.1') {
        // pass, easier to understand formatted this way.
    } else {
        if (document.location.href.slice(0, 5) == 'http:') {
            document.location = 'https:' + document.location.href.slice(6);
        }
    }

    // listen.
    omni_app.event_emitter.on('app:render', function() {
        var stack_length = omni_app.controller_stack.length;
        var current_controller = omni_app.controller_stack[stack_length-1];
        omni_app.present_controller(current_controller);
    });

    omni_app.event_emitter.on('command:cancel', function() {
        $("#ob-input").val('');
        $("#ob-input").blur();
    });

    omni_app.event_emitter.on('command:search', function() {
        $("#ob-input").val('?');
        $("#ob-input").focus();
    });

    omni_app.event_emitter.on('command:apply', function() {
        $("#ob-input").val('!');
        $("#ob-input").focus();
    });

    var list_controller = new ListController();
    omni_app.push_controller(list_controller);

    omni_app.storage_update()

    addEvent(window, 'storage', function (event) {
        omni_app.storage_update()
    })

    omni_app.event_emitter.fire('app:ready', omni_app);

    setTimeout(() => {
        omni_app.refresh()
    }, 100);
});

