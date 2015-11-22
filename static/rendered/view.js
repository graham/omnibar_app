'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var View = (function () {
    function View() {
        _classCallCheck(this, View);
    }

    _createClass(View, [{
        key: 'contructor',
        value: function contructor() {
            console.log('init inside view.');
        }
    }, {
        key: 'render',
        value: function render() {
            console.log("Core View rendering.");
            var d = document.createElement('div');
            d.innerHTML = "Someone didn't implement the render method on their view. :(";
            return d;
        }
    }, {
        key: 'prepare',
        value: function prepare() {
            console.log("Prepare basic ViewController.");
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            console.log("Destroy basic ViewController.");
        }
    }]);

    return View;
})();

var ListView = (function (_View) {
    _inherits(ListView, _View);

    function ListView() {
        _classCallCheck(this, ListView);

        _get(Object.getPrototypeOf(ListView.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ListView, [{
        key: 'render',
        value: function render(controller, is_done) {
            var table = document.createElement('table');
            table.className = 'ob-table ob-reset';

            if (controller.cursor_index >= controller.item_list.length) {
                controller.cursor_index = controller.item_list.length - 1;
            }

            if (controller.item_list.length == 0) {
                controller.cursor_index = 0;
            }

            controller.item_list.forEach(function (obj, _index) {
                obj.index = _index;

                if (controller.cursor_index == _index) {
                    obj.active = true;
                } else {
                    obj.active = false;
                }

                var d = null;

                try {
                    var it = new ItemRenderer();
                    d = it.parse(obj, controller);
                } catch (e) {
                    console.log(e, e.stack);
                    d = document.createElement('div');
                    d.innerHTML = "" + e.stack;
                }

                table.appendChild(d);
            });
            // Needs to be better.
            $("#ob-content").parent().animate({ 'scrollTop': 0 }, 10);

            is_done(table);
        }
    }]);

    return ListView;
})(View);