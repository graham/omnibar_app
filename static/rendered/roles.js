"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CoreRole = (function () {
    function CoreRole() {
        _classCallCheck(this, CoreRole);
    }

    _createClass(CoreRole, [{
        key: "on_event",
        value: function on_event(etype, event_object, item) {
            var cb = this['on_' + etype];
            if (cb != undefined) {
                return cb.apply(this, [event_object, item]);
            } else {
                return this.unhandled_event.apply(this, [etype, event_object]);
            }
        }
    }, {
        key: "unhandled_event",
        value: function unhandled_event(event_object) {
            console.log("Unhandled event " + JSON.stringify(event_object) + " on " + this + ".");
        }
    }, {
        key: "render",
        value: function render(item, parsed) {
            // pass
        }
    }]);

    return CoreRole;
})();

var StorageRole = (function (_CoreRole) {
    _inherits(StorageRole, _CoreRole);

    function StorageRole() {
        _classCallCheck(this, StorageRole);

        _get(Object.getPrototypeOf(StorageRole.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(StorageRole, [{
        key: "key",
        value: function key(uid) {
            return uid;
        }
    }, {
        key: "on_create",
        value: function on_create(event_object, item) {
            this.put_item(this.key(item.uid), item.text);
        }
    }, {
        key: "on_update",
        value: function on_update(event_object, item) {
            this.on_create(event_object, item);
        }
    }, {
        key: "on_delete",
        value: function on_delete(event_object, item) {
            console.log('lets delete ' + this.key(item.uid));
            this.delete_item(this.key(item.uid));
            item.archived = true;
        }
    }, {
        key: "delete_item",
        value: function delete_item(uid) {
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {
                localStorage.removeItem(key);
                resolve();
            });
        }
    }, {
        key: "get_item",
        value: function get_item(uid) {
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {
                resolve(localStorage.getItem(key));
            });
        }
    }, {
        key: "put_item",
        value: function put_item(uid, value) {
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {
                localStorage.setItem(key, value);
                resolve();
            });
        }
    }, {
        key: "update_item",
        value: function update_item(uid, new_value) {
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {
                var old_value = localStorage.getItem(key);
                localStorage.setItem(key, value);
                resolve(old_value);
            });
        }
    }, {
        key: "batch_get_item",
        value: function batch_get_item(list_of_keys) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var results = [];
                list_of_keys.forEach(function (uid) {
                    var key = _this.key(uid);
                    results.push(localStorage.getItem(key));
                });
                resolve(results);
            });
        }
    }, {
        key: "batch_write_item",
        value: function batch_write_item(list_of_pairs) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var results = [];
                list_of_keys.forEach(function (item) {
                    var _item = _slicedToArray(item, 2);

                    var uid = _item[0];
                    var value = _item[1];

                    var key = _this2.key(uid);
                    localStorage.setItem(key, value);
                });
                resolve();
            });
        }
    }, {
        key: "scan",
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

    return StorageRole;
})(CoreRole);

var BaseRole = (function (_StorageRole) {
    _inherits(BaseRole, _StorageRole);

    function BaseRole() {
        _classCallCheck(this, BaseRole);

        _get(Object.getPrototypeOf(BaseRole.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(BaseRole, [{
        key: "on_archive",
        value: function on_archive(event_object, item) {
            if (item.flagged != true) {
                item.archived = true;
            }
        }
    }, {
        key: "on_toggle_star",
        value: function on_toggle_star(event_object, item) {
            if (item.flagged) {
                item.flagged = false;
            } else {
                item.flagged = true;
            }
        }
    }, {
        key: "on_open",
        value: function on_open(event_object, item) {
            var body = item.as_line();
            var hit = false;

            body.split(' ').forEach(function (word) {
                if (word.slice(0, 4) == 'http' && hit == false) {
                    window.open(word);
                    hit = true;
                }
            });
        }
    }]);

    return BaseRole;
})(StorageRole);

omni_app.register_role('_base', BaseRole);