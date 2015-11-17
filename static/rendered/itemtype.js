'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ItemType = (function () {
    function ItemType() {
        _classCallCheck(this, ItemType);
    }

    _createClass(ItemType, [{
        key: 'on_event',
        value: function on_event(etype, event_object) {
            var cb = this['on_' + event_type];
            if (cb != undefined) {
                return cb(event_object);
            } else {
                return this.unhandled_event(event_object);
            }
        }
    }, {
        key: 'unhandled_event',
        value: function unhandled_event(event_object) {}
    }, {
        key: 'basic_render',
        value: function basic_render() {
            genie.fs(this.content, this.options);
        }
    }]);

    return ItemType;
})();