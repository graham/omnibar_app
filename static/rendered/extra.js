'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EmailRole = (function (_AbstractRole) {
    _inherits(EmailRole, _AbstractRole);

    function EmailRole() {
        _classCallCheck(this, EmailRole);

        _get(Object.getPrototypeOf(EmailRole.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(EmailRole, [{
        key: 'on_view',
        value: function on_view(eobj, item) {
            var p = item.parse();
            if (p.attr.id != undefined) {
                window.open('https://mail.google.com/mail/u/0/#inbox/' + p.attr.id);
            }
        }
    }]);

    return EmailRole;
})(AbstractRole);

omni_app.register_role('email', EmailRole);

var ConfigRole = (function (_AbstractRole2) {
    _inherits(ConfigRole, _AbstractRole2);

    function ConfigRole() {
        _classCallCheck(this, ConfigRole);

        _get(Object.getPrototypeOf(ConfigRole.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ConfigRole, [{
        key: 'render',
        value: function render(parsed, item) {
            if (item.get_meta('flagged')) {
                parsed.body += ' <span style="color: green;">ON<span> ';
            } else {
                parsed.body += ' <span style="color: rgba(255,0,0,0.5);">OFF</span> ';
            }

            parsed.attr['flagged_class_on'] = 'is_gear';
        }
    }]);

    return ConfigRole;
})(AbstractRole);

omni_app.register_role('config', ConfigRole);

var NiceTag = (function (_AbstractRole3) {
    _inherits(NiceTag, _AbstractRole3);

    function NiceTag() {
        _classCallCheck(this, NiceTag);

        _get(Object.getPrototypeOf(NiceTag.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(NiceTag, [{
        key: 'render',
        value: function render(parsed, item) {
            parsed.body = parsed.body.replace(/(#\w+)/g, "<span class='is_tag'>$1</span>");
        }
    }]);

    return NiceTag;
})(AbstractRole);

omni_app.register_role('tag', NiceTag);