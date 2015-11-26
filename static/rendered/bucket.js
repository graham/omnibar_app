'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Bucket = function Bucket(name) {
    _classCallCheck(this, Bucket);

    this.name = name;
};

var InMemoryBucket = (function (_Bucket) {
    _inherits(InMemoryBucket, _Bucket);

    function InMemoryBucket(name) {
        _classCallCheck(this, InMemoryBucket);

        _get(Object.getPrototypeOf(InMemoryBucket.prototype), 'constructor', this).call(this, name);
        this.item_dict = {};
    }

    _createClass(InMemoryBucket, [{
        key: 'delete_item',
        value: function delete_item(uid) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                delete _this.item_dict[uid];
                resolve();
            });
        }
    }, {
        key: 'get_item',
        value: function get_item(uid) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                resolve(_this2.item_dict[uid]);
            });
        }
    }, {
        key: 'put_item',
        value: function put_item(uid, value) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.item_dict[uid] = value;
                resolve();
            });
        }
    }, {
        key: 'update_item',
        value: function update_item(uid, new_value) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                var old_value = _this4.item_dict[uid];
                _this4.item_dict[uid] = new_value;
                resolve(old_value);
            });
        }
    }, {
        key: 'batch_get_item',
        value: function batch_get_item(list_of_keys) {
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                var results = [];
                list_of_keys.forEach(function (uid) {
                    results.push(_this5.item_dict[uid]);
                });
                resolve(results);
            });
        }
    }, {
        key: 'batch_write_item',
        value: function batch_write_item(list_of_pairs) {
            var _this6 = this;

            return new Promise(function (resolve, reject) {
                var results = [];
                list_of_keys.forEach(function (item) {
                    var _item = _slicedToArray(item, 2);

                    var key = _item[0];
                    var value = _item[1];

                    _this6.item_dict[key] = value;
                });
                resolve();
            });
        }
    }, {
        key: 'scan',
        value: function scan(options) {
            var _this7 = this;

            var results = [];
            var filter_function = options['filter'] || function () {
                return true;
            };

            return new Promise(function (resolve, reject) {
                var keys = _this7.item_dict.keys();
                keys.forEach(function (key) {
                    var temp_value = _this7.item_dict[key];
                    var include_item = filter_function(temp_value);
                    if (include_item) {
                        results.push(temp_value);
                    }
                });
                resolve(results);
            });
        }
    }]);

    return InMemoryBucket;
})(Bucket);

var LocalStorageBucket = (function (_Bucket2) {
    _inherits(LocalStorageBucket, _Bucket2);

    function LocalStorageBucket() {
        _classCallCheck(this, LocalStorageBucket);

        _get(Object.getPrototypeOf(LocalStorageBucket.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(LocalStorageBucket, [{
        key: 'delete_item',
        value: function delete_item(uid) {
            return new Promise(function (resolve, reject) {
                localStorage.removeItem(uid);
                resolve();
            });
        }
    }, {
        key: 'get_item',
        value: function get_item(uid) {
            return new Promise(function (resolve, reject) {
                resolve(localStorage.getItem(uid));
            });
        }
    }, {
        key: 'put_item',
        value: function put_item(uid, value) {
            return new Promise(function (resolve, reject) {
                localStorage.setItem(uid, value);
                resolve();
            });
        }
    }, {
        key: 'update_item',
        value: function update_item(uid, new_value) {
            return new Promise(function (resolve, reject) {
                var old_value = localStorage.getItem(uid);
                localStorage.setItem(uid, value);
                resolve(old_value);
            });
        }
    }, {
        key: 'batch_get_item',
        value: function batch_get_item(list_of_keys) {
            return new Promise(function (resolve, reject) {
                var results = [];
                list_of_keys.forEach(function (uid) {
                    results.push(localStorage.getItem(uid));
                });
                resolve(results);
            });
        }
    }, {
        key: 'batch_write_item',
        value: function batch_write_item(list_of_pairs) {
            return new Promise(function (resolve, reject) {
                var results = [];
                list_of_keys.forEach(function (item) {
                    var _item2 = _slicedToArray(item, 2);

                    var key = _item2[0];
                    var value = _item2[1];

                    localStorage.setItem(key, value);
                });
                resolve();
            });
        }
    }, {
        key: 'scan',
        value: function scan(options) {
            var _this8 = this;

            var results = [];
            var filter_function = options['filter'] || function () {
                return true;
            };

            return new Promise(function (resolve, reject) {
                var keys = [];
                for (var i = 0, len = localStorage.length; i < len; ++i) {
                    keys.push(localStorage.key(i));
                }

                keys.forEach(function (key) {
                    var temp_value = _this8.item_dict[key];
                    var include_item = filter_function(temp_value);
                    if (include_item) {
                        results.push(temp_value);
                    }
                });
                resolve(results);
            });
        }
    }]);

    return LocalStorageBucket;
})(Bucket);

var S3StorageBucket = (function (_Bucket3) {
    _inherits(S3StorageBucket, _Bucket3);

    function S3StorageBucket() {
        _classCallCheck(this, S3StorageBucket);

        _get(Object.getPrototypeOf(S3StorageBucket.prototype), 'constructor', this).apply(this, arguments);
    }

    return S3StorageBucket;
})(Bucket);