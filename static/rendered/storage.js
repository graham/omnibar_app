'use strict';

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
                var item = Item.from_json(localStorage.getItem(key));
                item.uid = uid;
                resolve(item);
            });
        }
    }, {
        key: 'put_item',
        value: function put_item(uid, value) {
            console.log('save -> ' + uid + " => " + value);
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {
                localStorage.setItem(key, value);
                resolve();
            });
        }
    }, {
        key: 'keys',
        value: function keys() {
            return new Promise(function (resolve, reject) {
                var keys = [];
                for (var i = 0, len = localStorage.length; i < len; ++i) {
                    keys.push(localStorage.key(i));
                }
                resolve(keys);
            });
        }
    }]);

    return LocalItemStorage;
})();

var S3Storage = (function () {
    function S3Storage() {
        _classCallCheck(this, S3Storage);
    }

    _createClass(S3Storage, null, [{
        key: 'key',
        value: function key(uid) {
            return uid;
        }
    }, {
        key: 'delete_item',
        value: function delete_item(uid) {
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {});
        }
    }, {
        key: 'get_item',
        value: function get_item(uid) {
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {
                $.get('/storage/get', { key: uid }).then(function (data) {
                    var item = Item.from_json(data);
                    item.uid = uid;
                    resolve(item);
                });
            });
        }
    }, {
        key: 'put_item',
        value: function put_item(uid, value) {
            console.log('S3 save -> ' + uid + " => " + value);
            var key = this.key(uid);
            return new Promise(function (resolve, reject) {
                $.post('/storage/put', { key: uid, value: value }).then(function (done) {
                    resolve();
                });
            });
        }
    }, {
        key: 'keys',
        value: function keys() {
            return new Promise(function (resolve, reject) {
                var response = [];
                var request = $.get('/storage/list').then(function (data) {
                    var keys = JSON.parse(data);
                    keys.forEach(function (values) {
                        response.push(values[0]);
                    });
                    resolve(response);
                });
            });
        }
    }]);

    return S3Storage;
})();