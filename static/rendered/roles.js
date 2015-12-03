"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractRole = (function () {
    function AbstractRole() {
        _classCallCheck(this, AbstractRole);
    }

    _createClass(AbstractRole, [{
        key: "on_event",

        // You should use this if you want to represent an item in a list
        // but it doesnt do any storage.

        value: function on_event(etype, event_object, item) {
            var cb = this['on_' + etype];
            if (cb != undefined) {
                try {
                    return cb.apply(this, [event_object, item]);
                } catch (e) {
                    console.log(" Failed during on_event(" + etype + ") on item => " + this.constructor.name + "\n" + e);
                }
            } else {
                return this.unhandled_event.apply(this, [etype, event_object]);
            }
        }
    }, {
        key: "unhandled_event",
        value: function unhandled_event(etype, event_object) {
            console.log("Unhandled event " + etype + " " + JSON.stringify(event_object) + " on " + this + ".");
        }
    }, {
        key: "render",
        value: function render(parsed, item) {
            // pass
        }
    }]);

    return AbstractRole;
})();

var CoreRole = (function (_AbstractRole) {
    _inherits(CoreRole, _AbstractRole);

    // Only subclass from here if you plan on storing the item somewhere.
    // If you dont change this.storage it will be stored locally.

    function CoreRole() {
        _classCallCheck(this, CoreRole);

        _get(Object.getPrototypeOf(CoreRole.prototype), "constructor", this).call(this);
        this.storage = LocalItemStorage;
    }

    _createClass(CoreRole, [{
        key: "on_create",
        value: function on_create(event_object, item) {
            this.storage.put_item(item.uid, item.as_json());
        }
    }, {
        key: "on_update",
        value: function on_update(event_object, item) {
            this.on_create(event_object, item);
        }
    }, {
        key: "on_delete",
        value: function on_delete(event_object, item) {
            console.log('lets delete ' + item.uid);
            this.storage.delete_item(item.uid);
            item.archived = true;
        }
    }]);

    return CoreRole;
})(AbstractRole);

var BaseRole = (function (_CoreRole) {
    _inherits(BaseRole, _CoreRole);

    function BaseRole() {
        _classCallCheck(this, BaseRole);

        _get(Object.getPrototypeOf(BaseRole.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(BaseRole, [{
        key: "on_archive",
        value: function on_archive(event_object, item) {
            if (item.get_meta('flagged') != true) {
                item.archived = true;
            }
        }
    }, {
        key: "on_toggle_flag",
        value: function on_toggle_flag(event_object, item) {
            if (item.get_meta('flagged') == true) {
                item.set_meta('flagged', false);
            } else {
                item.set_meta('flagged', true);
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
    }, {
        key: "on_view",
        value: function on_view(event_object, item) {
            this.on_open(event_object, item);
        }
    }]);

    return BaseRole;
})(CoreRole);

omni_app.register_role('_base', BaseRole);

var S3Role = (function (_CoreRole2) {
    _inherits(S3Role, _CoreRole2);

    function S3Role() {
        _classCallCheck(this, S3Role);

        _get(Object.getPrototypeOf(S3Role.prototype), "constructor", this).call(this);
        this.storage = S3Storage;
    }

    return S3Role;
})(CoreRole);

omni_app.register_role('s3', S3Role);