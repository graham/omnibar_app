'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
            if (this.env.template_dict['line_item'] == undefined) {
                return obj['content'];
            } else {
                return this.env.render('line_item', obj);
            }
        }
    }]);

    return ItemTransformer;
})();

var TestingTransformer = (function (_ItemTransformer) {
    _inherits(TestingTransformer, _ItemTransformer);

    function TestingTransformer() {
        _classCallCheck(this, TestingTransformer);

        _get(Object.getPrototypeOf(TestingTransformer.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(TestingTransformer, [{
        key: 'parse',
        value: function parse(obj, tools) {
            if (this.env.template_dict['line_item'] == undefined) {
                return obj['content'];
            } else {
                if (obj['content'] == 'cool') {
                    obj['content'] = '<center><img src="http://static1.gamespot.com/uploads/original/1550/15507091/2844654-1475930077-giphy.gif"></center>';
                }
                return this.env.render('line_item', obj);
            }
        }
    }]);

    return TestingTransformer;
})(ItemTransformer);