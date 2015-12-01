'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var LocalItemStorage = (function () {
    function LocalItemStorage() {
        _classCallCheck(this, LocalItemStorage);
    }

    _createClass(LocalItemStorage, null, [{
        key: 'key',
        value: function key(uid) {
            return uid;
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
        key: 'batch_write_item',
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
                    var include_item = key_filter_function(key);
                    if (include_item) {
                        try {
                            var item = Item.from_json(temp_value);
                            item.uid = key;
                            results.push([key, item]);
                        } catch (e) {
                            // pass
                        }
                    }
                });
                resolve(results);
            });
        }
    }]);

    return LocalItemStorage;
})();