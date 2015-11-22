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
            omni_app.fire_event("command_single:toggle_star", {"index":obj.index})
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
    
    parse(obj) {
        var tr, inner_div;
        [tr, inner_div] = this.create_base_tr(obj)
        inner_div.innerHTML = obj.parse()['body']

        var mixins = obj.parse_mixins();
        mixins.forEach((item) => {
            var tag = this.float_right();
            tag.innerHTML = item;
            inner_div.appendChild(tag)
        })

        return tr
    }
}

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

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

        return hits;
    }
    
    parse() {
        return string_to_item(this.text, action_chars)
    }

    static get_by_id(id) {
        return new Item(localStorage.getItem(id));
    }

    save() {
        return localStorage.setItem(this.id, this.text);
    }

    on_event(etype, event_object) {
        var mixins = this.parsed_mixins();
        mixins.forEach((m) => {
            m.on_event(etype, event_object, this.state)
        })
    }
}

class BaseMixin {
    on_event(etype, event_object, state_object) {
        let cb = this['on_' + event_type];
        if (cb != undefined) {
            return cb(event_object, state_object);
        } else {
            return this.unhandled_event(event_object, state_object);
        }
    }

    unhandled_event(event_object) {
        console.log("Unhandled event " + event_object + " on " + this + ".")
    }

    search(query) {
        return [];
    }
}
