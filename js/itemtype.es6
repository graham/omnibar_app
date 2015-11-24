// Hello

class ItemRenderer {
    constructor() {
        var _this = this;
    }

    create_base_tr(obj) {
        var tr = document.createElement('tr')

        if (obj.active) {
            tr.className = 'ob-tr active'
        } else {
            tr.className = 'ob-tr'
        }
        
        var select_td = document.createElement('td');
        select_td.className = 'ob-highlight';
        tr.appendChild(select_td);

        var checkbox_td = document.createElement('td');
        checkbox_td.className = 'ob-checkbox-holder'

        var internal_cb = document.createElement('input')
        internal_cb.type = 'checkbox'
        internal_cb.checked = obj.selected || false
        internal_cb.style.cssText = 'margin-top: 3px;'
        $(internal_cb).on('click', () => {
            omni_app.fire_event("control:select", {"index":obj.index})
        });

        checkbox_td.appendChild(internal_cb)
        tr.appendChild(checkbox_td)

        var outer_td = document.createElement('td')
        outer_td.style.cssText = 'width: auto;'

        var star_div = document.createElement('div')
        star_div.className = 'ob-star'
        
        if (obj.starred) {
            star_div.className += ' is_starred'
        } else {
            // boop
        }

        checkbox_td.appendChild(star_div)
        $(star_div).on('click', () => {
            obj.on_event('toggle_star', {})
        });

        var inner_div = document.createElement('div')
        inner_div.className = 'ob-inner'
        var content_div = document.createElement('div')
        content_div.className = 'ob-litem'
        
        inner_div.appendChild(content_div)
        outer_td.appendChild(inner_div)
        tr.appendChild(outer_td)

        return [tr, content_div]
    }

    float_right() {
        var d = document.createElement('div')
        d.className = 'ob-line-right'
        return d;
    }

    project_right() {
        var d = document.createElement('div')
        d.className = 'ob-project-right'
        return d;
    }
    
    parse(obj) {
        var tr, inner_div;
        [tr, inner_div] = this.create_base_tr(obj)
        inner_div.innerHTML = obj.as_line();

        var mixins = obj.parse_mixins();
        mixins.forEach((item) => {
            if (item != 'BaseMixin') {
                var tag = this.float_right();
                tag.innerHTML = item
                tag.style.backgroundColor = color_for_word(item);
                inner_div.appendChild(tag)
            }
        })

        return tr
    }
}

class Item {
    constructor(init_text) {
        this.id = null
        this.text = init_text
        this.state = {}
    }

    parse_mixins() {
        var hits = [];
        var item = this.parse();

        item['entries'].forEach((item) => {
            if (item[0] == ';') {
                hits.push(item[1])
            }
        })

        return hits.concat(['BaseMixin']);
    }

    parse() {
        return string_to_item(this.text, action_chars)
    }

    static get_by_id(id) {
        return new Item(localStorage.getItem(id));
    }

    on_event(etype, event_object) {
        var _this = this;
        var mixins = this.parse_mixins();
        mixins.forEach((m) => {
            var match = glob_mixins[m]
            if (match) {
                (new match).on_event(etype, event_object, _this)
            }
        })
    }

    as_line() {
        return this.parse()['body']
    }

    get_attr(key) {}
    set_attr(key, value) {}

    get_meta(key) {}
    set_meta(key, value) {}
}

class BaseMixin {
    on_event(etype, event_object, item) {
        let cb = this['on_' + etype];
        if (cb != undefined) {
            return cb(event_object, item)
        } else {
            return this.unhandled_event(etype, event_object)
        }
    }

    unhandled_event(event_object) {
        console.log("Unhandled event " + JSON.stringify(event_object) + " on " + this + ".")
    }

    search(query) {
        return [];
    }

    on_update(event_object, item) {
        var id = item.get_meta('uid')
        if (id == undefined) {
            item.set_meta('uid', id)
        }
        storage.setItem(id, item.text)
    }

    on_archive(event_object, item) {
        item.deleted = true
    }

    on_toggle_star(event_object, item) {
        if (item.starred) {
            item.starred = false
        } else {
            item.starred = true
        }
    }

    on_view(event_object, item) {
        var body = item.parse()['body']
        var hit = false
        
        body.split(' ').forEach((word) => {
            if (word.slice(0, 4) == 'http' && hit == false) {
                window.open(word);
                hit = true;
            }
        })
    }

}

var glob_mixins = {}
glob_mixins['BaseMixin'] = BaseMixin

