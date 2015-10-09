var OmniPluginItem = Class.extend({
    init: function(uuid, raw_data) {
        this.uuid = uuid || '';
        this.raw_data = raw_data || '';
    }
});

var OmniPluginSource = Class.extend({
    init: function() {
        this.data = [];
    },
    is_authorized: function() {},
    do_authorize: function() {},
    update: function() {},
    handle_action: function(action, items) {},
    
    pull_item: function(item) {},
    return_item: function(item) {}
});

