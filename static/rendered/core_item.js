'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Item = (function () {
    function Item(init_text) {
        _classCallCheck(this, Item);

        this.uid = null;
        this.meta = {};
        this.text = init_text;
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
            var roles = this.parse()['roles'];
            roles.forEach(function (m) {
                var match = omni_app.roles[m];
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
        key: 'set_text',
        value: function set_text(text) {
            this.dirty = true;
            this.text = text;
        }
    }, {
        key: '_raw_roles',
        value: function _raw_roles(role_expression) {
            var exclude_hit = false;
            var roles = [];
            var matches = this.text.match(role_expression);

            if (matches != undefined) {
                matches.forEach(function (role) {
                    role = str_trim(role);
                    if (role == ';;') {
                        exclude_hit = true;
                    }
                    roles.push(role.slice(1));
                });
                if (exclude_hit == false) {
                    return ['_base'].concat(roles);
                } else {
                    return roles;
                }
            } else {
                return ['_base'];
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
                return attrs;
            }
        }
    }, {
        key: 'parse',
        value: function parse() {
            var _this2 = this;

            var d = this.clean_parse();

            d['roles'].forEach(function (role) {
                if (omni_app.roles[role]) {
                    try {
                        omni_app.roles[role].render(d, _this2);
                    } catch (e) {
                        console.log("Role " + role + " failed during render() on item => " + _this2.constructor.name + "\n" + e);
                    }
                }
            });

            return d;
        }
    }, {
        key: 'clean_parse',
        value: function clean_parse() {
            var d = {};
            var role_expression = /;(\S+)(?:\s+)? ?/g;
            var attr_expression = /\$(?:[\w-]+)(?:=[\w\/]+|=["`].*["`])? ?/g;
            var body = this.text;

            // lets parse roles.
            d['roles'] = this._raw_roles(role_expression);
            body = body.replace(role_expression, '');

            // lets parse attributes
            d['attr'] = this._raw_attrs(attr_expression);
            body = body.replace(attr_expression, '');

            d['body'] = body;

            return d;
        }
    }, {
        key: 'as_line',
        value: function as_line() {
            return this.parse().body;
        }
    }], [{
        key: 'from_json',
        value: function from_json(text) {
            var data = JSON.parse(text);
            var item = new Item('');
            item.text = data['text'];
            item.meta = data['meta'];
            return item;
        }
    }, {
        key: 'from_text',
        value: function from_text(text) {
            var item = new Item(text);
            item.uid = uuid();
            return item;
        }
    }]);

    return Item;
})();