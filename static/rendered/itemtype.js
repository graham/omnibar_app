"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var color_for_word = function color_for_word(word) {
    var index = 0;
    var colors = [0, 0, 0];
    for (var i = 0; i < word.length; i++) {
        var ch = word.charCodeAt(i);
        colors[index] += ch * ch * ch;
        index += 1;
        index %= 3;
    }
    return "rgba(" + (64 + colors[0] % 224) + ", " + (64 + colors[1] % 224) + ", " + (64 + colors[2] % 224) + ", 0.85)";
};

var ItemRenderer = (function () {
    function ItemRenderer() {
        _classCallCheck(this, ItemRenderer);

        var _this = this;
    }

    _createClass(ItemRenderer, [{
        key: "create_base_tr",
        value: function create_base_tr(obj) {
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

            if (obj.starred) {
                star_div.className += ' is_starred';
            } else {
                // boop
            }

            checkbox_td.appendChild(star_div);
            $(star_div).on('click', function () {
                omni_app.fire_event("command_focus:toggle_star", { "index": obj.index });
            });

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
        key: "float_right",
        value: function float_right() {
            var d = document.createElement('div');
            d.className = 'ob-line-right';
            return d;
        }
    }, {
        key: "parse",
        value: function parse(obj) {
            var _this2 = this;

            var tr, inner_div;

            var _create_base_tr = this.create_base_tr(obj);

            var _create_base_tr2 = _slicedToArray(_create_base_tr, 2);

            tr = _create_base_tr2[0];
            inner_div = _create_base_tr2[1];

            inner_div.innerHTML = obj.as_line();

            var mixins = obj.parse_mixins();
            mixins.forEach(function (item) {
                if (item != 'BaseMixin') {
                    var tag = _this2.float_right();
                    tag.innerHTML = item;
                    tag.style.backgroundColor = color_for_word(item);
                    inner_div.appendChild(tag);
                }
            });

            return tr;
        }
    }]);

    return ItemRenderer;
})();

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
};

var Item = (function () {
    function Item(init_text) {
        _classCallCheck(this, Item);

        this.id = null;
        this.text = init_text;
        this.state = {};
    }

    _createClass(Item, [{
        key: "parse_mixins",
        value: function parse_mixins() {
            var hits = [];
            var item = this.parse();

            item['entries'].forEach(function (item) {
                if (item[0] == ';') {
                    hits.push(item[1]);
                }
            });

            return hits.concat(['BaseMixin']);
        }
    }, {
        key: "parse",
        value: function parse() {
            return string_to_item(this.text, action_chars);
        }
    }, {
        key: "save",
        value: function save() {
            return localStorage.setItem(this.id, this.text);
        }
    }, {
        key: "on_event",
        value: function on_event(etype, event_object) {
            var _this3 = this;

            var mixins = this.parsed_mixins();
            mixins.forEach(function (m) {
                m.on_event(etype, event_object, _this3.state);
            });
        }
    }, {
        key: "as_line",
        value: function as_line() {
            return this.parse()['body'];
        }
    }], [{
        key: "get_by_id",
        value: function get_by_id(id) {
            return new Item(localStorage.getItem(id));
        }
    }]);

    return Item;
})();

var BaseMixin = (function () {
    function BaseMixin() {
        _classCallCheck(this, BaseMixin);
    }

    _createClass(BaseMixin, [{
        key: "on_event",
        value: function on_event(etype, event_object, item) {
            var cb = this['on_' + etype];
            if (cb != undefined) {
                return cb(event_object, item);
            } else {
                return this.unhandled_event(etype, event_object);
            }
        }
    }, {
        key: "unhandled_event",
        value: function unhandled_event(event_object) {
            console.log("Unhandled event " + JSON.stringify(event_object) + " on " + this + ".");
        }
    }, {
        key: "search",
        value: function search(query) {
            return [];
        }
    }, {
        key: "save",
        value: function save() {}
    }, {
        key: "load",
        value: function load(text) {}
    }, {
        key: "on_archive",
        value: function on_archive(event_object, item) {
            item.deleted = true;
        }
    }, {
        key: "on_toggle_star",
        value: function on_toggle_star(event_object, item) {
            item.starred = true;
        }
    }, {
        key: "on_view",
        value: function on_view(event_object, item) {
            var body = item.parse()['body'];
            var hit = false;

            body.split(' ').forEach(function (word) {
                if (word.slice(0, 4) == 'http' && hit == false) {
                    window.open(word);
                    hit = true;
                }
            });
        }
    }]);

    return BaseMixin;
})();

var glob_mixins = {};
glob_mixins['BaseMixin'] = BaseMixin;