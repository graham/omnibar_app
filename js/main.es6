var mydbconn = jsredis.connect('local');

class SourceController extends OmniListController {
    prepare() {
        var _this = this;
        
        super.prepare();
        
        _this.beacon.on('command_multi:archive', function(options) {
            _this.map_selected(function(item) {
                mydbconn.cmd('rpush', 'archived', item);
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
