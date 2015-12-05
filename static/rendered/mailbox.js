'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PromiseAccumulator = (function () {
    function PromiseAccumulator() {
        _classCallCheck(this, PromiseAccumulator);

        this.callback_list = [];
        this.last_promise = null;
    }

    _createClass(PromiseAccumulator, [{
        key: 'queue',
        value: function queue(cb) {
            this.callback_list.push(cb);

            if (this.last_promise == null) {
                this.step();
            }
        }
    }, {
        key: 'step',
        value: function step() {
            var _this2 = this;

            if (this.callback_list.length == 0) {
                return;
            }

            var head = this.callback_list[0];
            var rest = this.callback_list.slice(1);
            var _this = this;
            this.callback_list = rest;

            this.last_promise = new Promise(head);

            this.last_promise.then(function () {
                console.log('done');
                _this2.last_promise = null;
                _this2.step();
            }, function (error) {
                console.log(error);
                _this2.last_promise = null;
                _this2.step();
            });
        }
    }]);

    return PromiseAccumulator;
})();