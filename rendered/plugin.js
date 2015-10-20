'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PluginManager = (function () {
    function PluginManager() {
        _classCallCheck(this, PluginManager);

        this.transformers = new Map();
        this.sources = new Map();
        this.item_types = new Map();

        this.default_transformer = null;
        this.default_source = null;
        this.default_type = null;
    }

    _createClass(PluginManager, [{
        key: 'register_transformer',
        value: function register_transformer(name, trans) {
            this.transformers.set(name, trans);
        }
    }, {
        key: 'register_source',
        value: function register_source(name, source) {
            this.sources.set(name, source);
        }
    }, {
        key: 'register_type',
        value: function register_type(name, type) {
            this.item_type.set(name, type);
        }
    }]);

    return PluginManager;
})();

var ItemType = function ItemType() {
    _classCallCheck(this, ItemType);
};

var ItemSource = function ItemSource() {
    _classCallCheck(this, ItemSource);
};

var ItemTransformer = (function () {
    function ItemTransformer() {
        _classCallCheck(this, ItemTransformer);

        var _this = this;
        this.env = new genie.Environment();

        $.get('templates/line_item.genie', function (data) {
            _this.env.create_template('line_item', data);
            omni_app.refresh();
        });
    }

    _createClass(ItemTransformer, [{
        key: 'parse',
        value: function parse(obj, tools) {
            console.log(obj);
            if (this.env.template_dict['line_item'] == undefined) {
                return obj['content'];
            } else {
                return this.env.render('line_item', obj);
            }
        }
    }]);

    return ItemTransformer;
})();