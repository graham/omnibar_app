var OmniApplication = (function() {
    var Application = function() {
        var _this = this;

        this.view_stack = [];
        this.after_load = [];

        this.kap = new kapture.Kapture();
        $(window).keydown(function(event) {
            _this.kap.key_down(event);
        });
    };

    Application.prototype.ready = function(cb) {
        this.after_load.push(cb);
    };

    Application.prototype.finish_loading_app = function() {
        var _this = this;
        for(var i = 0; i < this.after_load.length; i++) {
            this.after_load[i](_this);
        }

    };

    Application.prototype.push_view = function(view, options) {

    };

    Application.prototype.pop_view = function(options) {

    };

    return Application;
})();
