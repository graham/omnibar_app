var mydbconn = jsredis.connect('local');

class SourceController extends OmniListController {
    prepare() {
        var _this = this;
        
        OmniListController.prototype.prepare.call(this, []);
        
        _this.beacon.on('command_multi:archive', function(options) {
            _this.map_selected(function(item) {
                return undefined;
            }).then(function() {
                omni_app.refresh();
            });
        });

        _this.beacon.on('command_multi:info', function(options) {
            _this.map_selected(function(item) {
                console.log(JSON.stringify(item));
                return item;
            }).then(function() {
                omni_app.refresh();
            });
        });

        _this.beacon.on('command_multi:right', function(options) {
            _this.map_selected(function(item) {
                item.content = '.' + item.content;
                return item;
            }).then(function() {
                omni_app.refresh();
            });
        });

        _this.beacon.on('command_multi:left', function(options) {
            _this.map_selected(function(item) {
                if (item.content[0] == '.') {
                    item.content = item.content.slice(1);
                }
                return item;
            }).then(function() {
                omni_app.refresh();
            });
        });

        _this.beacon.on('command_single:edit', function(options) {
            _this.map_focused(function(item) {
                $("#ob-input").val(item.content);
                $("#ob-input").focus();
                return undefined;
            }).then(function() {
                omni_app.refresh();
            });
        });
    }
}

// Our App Code.

omni_app.ready(function(label, args) {
    $("#ob-input").focus();
    
    omni_app.event_emitter.on('app:bar_updated', function() {
        console.log($("#ob-input").val());
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

    var stock_view = new SourceController();
    omni_app.push_view(stock_view);
});
