'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Item = (function () {
    function Item(init_text) {
        _classCallCheck(this, Item);

        this.meta = {};
        this.text = init_text;
        this.dirty = false;
        this.pipeline = new PromiseAccumulator();
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
        key: 'touch',
        value: function touch() {
            this.dirty = true;
        }
    }, {
        key: 'on_event_end',
        value: function on_event_end(etype) {
            console.log('event end -> ' + etype);
        }
    }, {
        key: 'on_event',
        value: function on_event(etype, event_object) {
            var _this2 = this;

            var _this = this;
            var roles = this.parse()['roles'];
            var return_promises = [];
            var new_state = Item.from_json(this.as_json());

            roles.forEach(function (m) {
                var match = omni_app.roles[m];
                if (match) {
                    _this2.pipeline.queue(function (resolve, reject) {
                        var prom = match.on_event(etype, event_object, new_state, _this);
                        if (prom != undefined) {
                            return_promises.push(prom);
                            prom.then(function () {
                                resolve();
                            }, function (error) {
                                console.log(error);
                            });
                        } else {
                            resolve();
                        }
                    });
                }
            });

            var all_promise = Promise.all(return_promises);
            all_promise.then(function () {
                _this2.meta = new_state.meta;
                _this2.text = new_state.text;
                _this2.dirty = new_state.dirty;
                _this2.on_event_end(etype);
            });
            return all_promise;
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
        key: 'parse',
        value: function parse() {
            var _this3 = this;

            var d = this.clean_parse();

            d['roles'].forEach(function (role) {
                if (omni_app.roles[role]) {
                    try {
                        omni_app.roles[role].render(d, _this3);
                    } catch (e) {
                        console.log("Role " + role + " failed during render() on item => " + _this3.constructor.name + "\n" + e);
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
            if (this.dirty) {
                return this.parse().body + "*";
            } else {
                return this.parse().body;
            }
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
                if (exclude_hit == false && this.get_meta('is_search_result') != true) {
                    return roles.concat(['_base']);
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
    }], [{
        key: 'from_json',
        value: function from_json(text) {
            console.log("ITEMLOAD: " + text);
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
            item.set_meta('uid', uuid());
            return item;
        }
    }]);

    return Item;
})();