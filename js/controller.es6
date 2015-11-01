class Controller {
    constructor(view) {
        this.view = view
    }
    render() {
        return this.view.render()
    }
}

class OmniListController extends Controller {
    constructor() {
        // Call the superclass init with nothing.
        super(new OmniListView());
        
        // Now some local stuff.
        this.item_list = [];
        this.cursor_index = 0;
        this.beacon = new Beacon();
    }
    
    get_selected() {
        var results = [];
        this.item_list.forEach((item, index) => {
            if (item.selected == true) {
                results.push(item);
            }
        });
        return results;
    }
    
    map_selected(fn) {
        
    }
    
    get_focused() { return this.item_list[this.cursor_index]; }
    map_focused(fn) { }

    prepare() {
        var _this = this;
        
        _this.beacon.on('command:enter', function(options) {
            var value = $("#ob-input").val();
            
            _this.item_list.push({'content':value});
            console.log("value: " + value);
            omni_app.refresh();
            
            $("#ob-input").val('');
            $("#ob-input").blur();
        });

        _this.beacon.on('control:select', function(options) {
            
        });

        _this.beacon.on('command_single:toggle_star', function(options) {
        });

        
        _this.beacon.on('control:deselect_all', function(options) {
        });

        _this.beacon.on('control:select_all', function(options) {
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
        });

        _this.beacon.on('control:move_down_more', function(options) {
            _this.cursor_index += 10;
        });
        
        _this.beacon.on('control:move_bottom', function(options) {
        });
    }
}
