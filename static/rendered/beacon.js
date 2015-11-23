'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Beacon = (function () {
    function Beacon() {
        _classCallCheck(this, Beacon);

        this.obs = {};
        this.to_remove = [];
        this.obs_id = 1;
    }

    _createClass(Beacon, [{
        key: 'next_id',
        value: function next_id() {
            this.obs_id += 1;
            return this.obs_id;
        }
    }, {
        key: 'smart_add',
        value: function smart_add(name, o) {
            if (this.obs[name] == undefined) {
                this.obs[name] = [o];
            } else {
                this.obs[name].push(o);
            }
        }
    }, {
        key: 'on',
        value: function on(name, cb) {
            var uid = this.next_id();
            this.smart_add(name, [cb, true, uid]);
            return uid;
        }
    }, {
        key: 'once',
        value: function once(name, cb) {
            var uid = this.next_id();
            this.smart_add(name, [cb, false, uid]);
            return uid;
        }
    }, {
        key: 'fire',
        value: function fire(name, options) {
            if (options === undefined) {
                options = {};
            }
            var did_hit = false;
            if (this.obs[name] != undefined) {
                var ll = this.obs[name];
                options['event_name'] = name;
                var args = options;
                var response = this.publish_event_to_list(ll, args);
                this.obs[name] = response[0];
                did_hit = response[1];
            }

            if (did_hit) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'publish_event_to_list',
        value: function publish_event_to_list(ll, args) {
            var new_list = [];
            var now_final = false;
            var did_hit = false;

            for (var i = 0; i < ll.length; i += 1) {
                if (this.x_in_list(ll[i][2], this.to_remove)) {
                    // pass, either it's not a continue, or it's in the remove list.
                    this.to_remove = this.remove_x_from_list(ll[i][2], to_remove);
                } else {
                    now_final = ll[i][0].apply(null, [args]);
                    did_hit = true;
                    if (now_final != false) {
                        if (ll[i][1]) {
                            new_list.push(ll[i]);
                        }
                    }
                }
            }
            return [new_list, did_hit];
        }
    }, {
        key: 'remove_x_from_list',
        value: function remove_x_from_list(x, the_list) {
            var new_list = [];
            for (var i = 0; i < the_list.length; i += 1) {
                if (x != the_list[i]) {
                    new_list.push(the_list[i]);
                }
            }
            return new_list;
        }
    }, {
        key: 'x_in_list',
        value: function x_in_list(x, the_list) {
            var l = the_list.length;
            for (var i = 0; i < l; i += 1) {
                if (x == the_list[i]) {
                    return true;
                }
            }
            return false;
        }
    }]);

    return Beacon;
})();

var SafePromise = Promise;

var Promise = function Promise(fn) {
    return new SafePromise(function (resolve, reject) {
        try {
            fn(resolve, reject);
        } catch (e) {
            alert(e);
            reject();
        }
    });
};