'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Item = (function () {
    function Item(init_text) {
        _classCallCheck(this, Item);

        this.meta = {};
        this.text = init_text;
        this.uid = null;
        this.dirty = false;
    }

    _createClass(Item, [{
        key: 'as_json',
        value: function as_json() {
            return JSON.stringify({
                'text': this.text,
                'meta': this.meta
            });
        }
    }, {
        key: 'on_event',
        value: function on_event(etype, event_object) {
            var _this = this;
            var mixins = this.parse()['mixins'];
            mixins.forEach(function (m) {
                var match = glob_mixins[m];
                if (match) {
                    match.on_event(etype, event_object, _this);
                }
            });
        }
    }, {
        key: 'get_meta',
        value: function get_meta(key) {
            return this.meta[key];
        }
    }, {
        key: 'set_meta',
        value: function set_meta(key, value) {
            this.dirty = true;
            this.meta[key] = value;
        }
    }, {
        key: '_raw_mixins',
        value: function _raw_mixins(mixin_expression) {
            var mixins = [];
            var matches = this.text.match(mixin_expression);

            if (matches != undefined) {
                matches.forEach(function (mixin) {
                    mixins.push(str_trim(mixin.slice(1)));
                });
                return mixins;
            } else {
                return [];
            }
        }
    }, {
        key: '_raw_attrs',
        value: function _raw_attrs(attr_expression) {
            var attrs = {};
            var matches = this.text.match(attr_expression);

            if (matches != undefined) {
                matches.forEach(function (match) {
                    match = match.slice(1);
                    if (match.indexOf('=') == -1) {
                        var key = str_trim(match);
                        attrs[key] = true;
                    } else {
                        var sp = match.split('=');
                        if (sp[1][0] == '`') {
                            var value = sp[1].slice(1, sp[1].length - 2);
                            attrs[sp[0]] = JSON.parse(str_trim(value));
                        } else if (sp[1][0] == '"') {
                            attrs[sp[0]] = JSON.parse(str_trim(sp[1]));
                        } else {
                            attrs[sp[0]] = str_trim(sp[1]);
                        }
                    }
                });
                return attrs;
            } else {
                return {};
            }
        }
    }, {
        key: 'parse',
        value: function parse() {
            var d = {};
            var mixin_expression = /;(\S+)(?:\s+)? ?/g;
            var attr_expression = /\$(?:[\w-]+)(?:=[\w]+|=["`].*["`])? ?/g;
            var body = this.text;

            // lets parse mixins.
            d['mixins'] = this._raw_mixins(mixin_expression);
            body = body.replace(mixin_expression, '');

            // lets parse attributes
            d['attr'] = this._raw_attrs(attr_expression);
            body = body.replace(attr_expression, '');

            d['body'] = body;
            return d;
        }
    }, {
        key: 'rev',
        value: function rev() {
            return '';
        }
    }], [{
        key: 'from_json',
        value: function from_json(text) {
            var data = JSON.parse(text);
            this.text = data['text'];
            this.meta = data['meta'];
        }
    }]);

    return Item;
})();