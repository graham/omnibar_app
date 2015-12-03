// Hello

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ItemRenderer = (function () {
    function ItemRenderer() {
        _classCallCheck(this, ItemRenderer);

        var _this = this;
    }

    _createClass(ItemRenderer, [{
        key: 'create_base_tr',
        value: function create_base_tr(obj) {
            var parsed = obj.parse();
            var tr = document.createElement('tr');

            if (obj.active) {
                tr.className = 'ob-tr active';
            } else {
                tr.className = 'ob-tr';
            }

            var select_td = document.createElement('td');
            select_td.className = 'ob-highlight';
            tr.appendChild(select_td);

            var checkbox_td = document.createElement('td');
            checkbox_td.className = 'ob-checkbox-holder';

            var internal_cb = document.createElement('input');
            internal_cb.type = 'checkbox';
            internal_cb.checked = obj.selected || false;
            internal_cb.style.cssText = 'margin-top: 3px;';
            $(internal_cb).on('click', function () {
                omni_app.fire_event("control:select", { "index": obj.index });
            });

            checkbox_td.appendChild(internal_cb);
            tr.appendChild(checkbox_td);

            var outer_td = document.createElement('td');
            outer_td.style.cssText = 'width: auto;';

            var star_div = document.createElement('div');
            star_div.className = 'ob-star';

            if (obj.get_meta('flagged')) {
                if (parsed.attr.flagged_class_on) {
                    star_div.className += ' ' + parsed.attr.flagged_class_on;
                } else {
                    star_div.className += ' is_flagged';
                }
            } else {
                if (parsed.attr.flagged_class_off) {
                    star_div.className += ' ' + parsed.attr.flagged_class_off;
                } else {
                    star_div.className += ' is_not_flagged';
                }
            }

            checkbox_td.appendChild(star_div);

            var inner_div = document.createElement('div');
            inner_div.className = 'ob-inner';
            var content_div = document.createElement('div');
            content_div.className = 'ob-litem';

            inner_div.appendChild(content_div);
            outer_td.appendChild(inner_div);
            tr.appendChild(outer_td);

            return [tr, content_div];
        }
    }, {
        key: 'float_right',
        value: function float_right() {
            var d = document.createElement('div');
            d.className = 'ob-line-right';
            return d;
        }
    }, {
        key: 'project_right',
        value: function project_right() {
            var d = document.createElement('div');
            d.className = 'ob-project-right';
            return d;
        }
    }, {
        key: 'parse',
        value: function parse(obj) {
            var _this2 = this;

            var tr, inner_div;

            var _create_base_tr = this.create_base_tr(obj);

            var _create_base_tr2 = _slicedToArray(_create_base_tr, 2);

            tr = _create_base_tr2[0];
            inner_div = _create_base_tr2[1];

            inner_div.innerHTML = obj.as_line();

            var roles = obj.parse()['roles'];
            roles.reverse();
            roles.forEach(function (item) {
                //if (item[0] != '_') {
                var tag = _this2.float_right();
                tag.innerHTML = item;
                tag.style.backgroundColor = color_for_word(item);
                inner_div.appendChild(tag);
                //}
            });

            return tr;
        }
    }]);

    return ItemRenderer;
})();