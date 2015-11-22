"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WordsMixin = (function (_BaseMixin) {
    _inherits(WordsMixin, _BaseMixin);

    function WordsMixin() {
        _classCallCheck(this, WordsMixin);

        _get(Object.getPrototypeOf(WordsMixin.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(WordsMixin, [{
        key: "search",
        value: function search(query) {
            return [new Item("words"), new Item("are"), new Item("fun"), new Item("right?")];
        }
    }]);

    return WordsMixin;
})(BaseMixin);

var NumbersMixin = (function (_BaseMixin2) {
    _inherits(NumbersMixin, _BaseMixin2);

    function NumbersMixin() {
        _classCallCheck(this, NumbersMixin);

        _get(Object.getPrototypeOf(NumbersMixin.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(NumbersMixin, [{
        key: "search",
        value: function search(query) {
            var results = [];
            for (var i = 0; i < 20; i++) {
                results.push(new Item('' + i));
            }
            return results;
        }
    }]);

    return NumbersMixin;
})(BaseMixin);