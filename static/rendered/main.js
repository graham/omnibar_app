'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mydbconn = jsredis.connect('local');

var SourceController = (function (_OmniListController) {
    _inherits(SourceController, _OmniListController);

    function SourceController() {
        _classCallCheck(this, SourceController);

        _get(Object.getPrototypeOf(SourceController.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(SourceController, [{
        key: 'prepare',
        value: function prepare() {
            var _this = this;

            _get(Object.getPrototypeOf(SourceController.prototype), 'prepare', this).call(this);

            _this.beacon.on('command_multi:archive', function (options) {
                _this.map_selected(function (item) {
                    mydbconn.cmd('rpush', 'archived', item);
                    return undefined;
                }).then(function () {
                    omni_app.refresh();
                });
            });

            _this.beacon.on('command_multi:info', function (options) {
                _this.map_selected(function (item) {
                    console.log(JSON.stringify(item));
                    return item;
                }).then(function () {
                    omni_app.refresh();
                });
            });

            _this.beacon.on('command_multi:right', function (options) {
                _this.map_selected(function (item) {
                    item.content = '.' + item.content;
                    return item;
                }).then(function () {
                    omni_app.refresh();
                });
            });

            _this.beacon.on('command_multi:left', function (options) {
                _this.map_selected(function (item) {
                    if (item.content[0] == '.') {
                        item.content = item.content.slice(1);
                    }
                    return item;
                }).then(function () {
                    omni_app.refresh();
                });
            });

            _this.beacon.on('command_single:edit', function (options) {
                _this.map_focused(function (item) {
                    $("#ob-input").val(item.content);
                    $("#ob-input").focus();
                    return undefined;
                }).then(function () {
                    omni_app.refresh();
                });
            });
        }
    }]);

    return SourceController;
})(OmniListController);