(function() {
    var RandomWordItem = OmniPluginItem.extend({

    });
    
    var RandomWordsSource = OmniPluginSource.extend({
        init_data: function() {
            this.data = [];
            this.counter = 0;
        },
        update: function() {
            while (this.data.length < 10) {
                this.counter += 1;
                this.data.push(new RandomWordItem(this, 'uuid-' + this.counter,
                                                  'the count is ' + this.counter));
            }
        }
    });
    
    omni_app.register_plugin({
        'source':RandomWordsSource
        'itemtype':RandomWordItem
        'controllers': []
    });
})();
