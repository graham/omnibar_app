// Hello

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ItemRenderer = (function () {
    function ItemRenderer() {
        _classCallCheck(this, ItemRenderer);

        var _this = this;
    }

    _createClass(ItemRenderer, [{
        key: 'create_base_tr',
        value: function create_base_tr(obj) {
            var tr = document.createElement('tr');

            if (obj.active) {
                tr.className = 'ob-tr active';
            } else {
                tr.className = 'ob-tr';
            }

            var select_td = document.createElement('td');
            select_td.className = 'ob-highlight';
            tr.appendChild(select_td);

            var checkbox_td = document.createElement('td');
            checkbox_td.className = 'ob-checkbox-holder';

            var internal_cb = document.createElement('input');
            internal_cb.type = 'checkbox';
            internal_cb.checked = obj.selected || false;
            internal_cb.style.cssText = 'margin-top: 3px;';
            $(internal_cb).on('click', function () {
                omni_app.fire_event("control:select", { "index": obj.index });
            });

            checkbox_td.appendChild(internal_cb);
            tr.appendChild(checkbox_td);

            var outer_td = document.createElement('td');
            outer_td.style.cssText = 'width: auto;';

            var star_div = document.createElement('div');
            star_div.className = 'ob-star';

            if (obj.starred) {
                star_div.className += ' is_starred';
            } else {
                // boop
            }

            checkbox_td.appendChild(star_div);
            $(star_div).on('click', function () {
                obj.on_event('toggle_star', {});
            });

            var inner_div = document.createElement('div');
            inner_div.className = 'ob-inner';
            var content_div = document.createElement('div');
            content_div.className = 'ob-litem';

            inner_div.appendChild(content_div);
            outer_td.appendChild(inner_div);
            tr.appendChild(outer_td);

            return [tr, content_div];
        }
    }, {
        key: 'float_right',
        value: function float_right() {
            var d = document.createElement('div');
            d.className = 'ob-line-right';
            return d;
        }
    }, {
        key: 'project_right',
        value: function project_right() {
            var d = document.createElement('div');
            d.className = 'ob-project-right';
            return d;
        }
    }, {
        key: 'parse',
        value: function parse(obj) {
            var _this2 = this;

            var tr, inner_div;

            var _create_base_tr = this.create_base_tr(obj);

            var _create_base_tr2 = _slicedToArray(_create_base_tr, 2);

            tr = _create_base_tr2[0];
            inner_div = _create_base_tr2[1];

            inner_div.innerHTML = obj.as_line();

            var mixins = obj.parse_mixins();
            mixins.forEach(function (item) {
                if (item != 'BaseMixin') {
                    var tag = _this2.float_right();
                    tag.innerHTML = item;
                    tag.style.backgroundColor = color_for_word(item);
                    inner_div.appendChild(tag);
                }
            });

            return tr;
        }
    }]);

    return ItemRenderer;
})();

var Item = (function () {
    function Item(init_text) {
        _classCallCheck(this, Item);

        this.uid = uuid();
        this.text = init_text;
    }

    _createClass(Item, [{
        key: 'parse_mixins',
        value: function parse_mixins() {
            var hits = [];
            var item = this.parse();

            item['entries'].forEach(function (item) {
                if (item[0] == ';') {
                    hits.push(item[1]);
                }
            });

            return hits.concat(['BaseMixin']);
        }
    }, {
        key: 'parse',
        value: function parse() {
            return string_to_item(this.text, action_chars);
        }
    }, {
        key: 'on_event',
        value: function on_event(etype, event_object) {
            var _this = this;
            var mixins = this.parse_mixins();
            mixins.forEach(function (m) {
                var match = glob_mixins[m];
                if (match) {
                    match.on_event(etype, event_object, _this);
                }
            });
        }
    }, {
        key: 'as_line',
        value: function as_line() {
            return this.parse()['body'];
        }
    }, {
        key: 'get_attr',
        value: function get_attr(key) {}
    }, {
        key: 'set_attr',
        value: function set_attr(key, value) {}
    }, {
        key: 'get_meta',
        value: function get_meta(key) {}
    }, {
        key: 'set_meta',
        value: function set_meta(key, value) {}
    }]);

    return Item;
})();

var StorageMixin = (function () {
    function StorageMixin() {
        _classCallCheck(this, StorageMixin);

        this.prefix = '';
    }

    _createClass(StorageMixin, [{
        key: 'key',
        value: function key(uid) {
            if (startswith(uid, this.prefix)) {
                return uid;
            } else {
                return this.prefix + uid;
            }
        }
    }, {
        key: 'on_create',
        value: function on_create(event_object, item) {
            this.put_item(this.key(item.uid), item.text);
        }
    }, {
        key: 'on_delete',
        value: function on_delete(event_object, item) {
            console.log('lets delete ' + this.key(item.uid));
            this.delete_item(this.key(item.uid));
            item.deleted = true;
        }
    }, {
        key: 'delete_item',
        value: function delete_item(uid) {
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {
                localStorage.removeItem(key);
                resolve();
            });
        }
    }, {
        key: 'get_item',
        value: function get_item(uid) {
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {
                resolve(localStorage.getItem(key));
            });
        }
    }, {
        key: 'put_item',
        value: function put_item(uid, value) {
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {
                localStorage.setItem(key, value);
                resolve();
            });
        }
    }, {
        key: 'update_item',
        value: function update_item(uid, new_value) {
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {
                var old_value = localStorage.getItem(key);
                localStorage.setItem(key, value);
                resolve(old_value);
            });
        }
    }, {
        key: 'batch_get_item',
        value: function batch_get_item(list_of_keys) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                var results = [];
                list_of_keys.forEach(function (uid) {
                    var key = _this3.key(uid);
                    results.push(localStorage.getItem(key));
                });
                resolve(results);
            });
        }
    }, {
        key: 'batch_write_item',
        value: function batch_write_item(list_of_pairs) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                var results = [];
                list_of_keys.forEach(function (item) {
                    var _item = _slicedToArray(item, 2);

                    var uid = _item[0];
                    var value = _item[1];

                    var key = _this4.key(uid);
                    localStorage.setItem(key, value);
                });
                resolve();
            });
        }
    }, {
        key: 'scan',
        value: function scan(options) {
            if (options == undefined) {
                options = {};
            }
            var results = [];
            var key_filter_function = options['key_filter'] || function () {
                return true;
            };

            return new Promise(function (resolve, reject) {
                var keys = [];
                for (var i = 0, len = localStorage.length; i < len; ++i) {
                    keys.push(localStorage.key(i));
                }

                keys.forEach(function (key) {
                    var temp_value = localStorage.getItem(key);
                    var include_item = key_filter_function(temp_value);
                    if (include_item) {
                        results.push([key, temp_value]);
                    }
                });
                resolve(results);
            });
        }
    }]);

    return StorageMixin;
})();

var BaseMixin = (function (_StorageMixin) {
    _inherits(BaseMixin, _StorageMixin);

    function BaseMixin() {
        _classCallCheck(this, BaseMixin);

        _get(Object.getPrototypeOf(BaseMixin.prototype), 'constructor', this).call(this);
        this.beacon = new Beacon();
    }

    _createClass(BaseMixin, [{
        key: 'on_event',
        value: function on_event(etype, event_object, item) {
            var cb = this['on_' + etype];
            if (cb != undefined) {
                return cb.apply(this, [event_object, item]);
            } else {
                return this.unhandled_event(etype, event_object);
            }
        }
    }, {
        key: 'unhandled_event',
        value: function unhandled_event(event_object) {
            console.log("Unhandled event " + JSON.stringify(event_object) + " on " + this + ".");
        }
    }, {
        key: 'on_archive',
        value: function on_archive(event_object, item) {
            if (item.starred != true) {
                item.deleted = true;
            }
        }
    }, {
        key: 'on_toggle_star',
        value: function on_toggle_star(event_object, item) {
            if (item.starred) {
                item.starred = false;
            } else {
                item.starred = true;
            }
        }
    }, {
        key: 'on_view',
        value: function on_view(event_object, item) {
            var body = item.parse()['body'];
            var hit = false;

            body.split(' ').forEach(function (word) {
                if (word.slice(0, 4) == 'http' && hit == false) {
                    window.open(word);
                    hit = true;
                }
            });
        }
    }]);

    return BaseMixin;
})(StorageMixin);

var ConfigMixin = (function (_BaseMixin) {
    _inherits(ConfigMixin, _BaseMixin);

    function ConfigMixin() {
        _classCallCheck(this, ConfigMixin);

        _get(Object.getPrototypeOf(ConfigMixin.prototype), 'constructor', this).call(this);
    }

    return ConfigMixin;
})(BaseMixin);

var glob_mixins = {};
glob_mixins['BaseMixin'] = new BaseMixin();
glob_mixins['config'] = new ConfigMixin();