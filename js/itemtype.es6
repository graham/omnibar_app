var color_for_word = function(word) {
    var index = 0;
    var colors = [0, 0, 0];
    for(var i=0; i < word.length; i++) {
        var ch = word.charCodeAt(i);
        colors[index] += ch * ch * ch;
        index += 1;
        index %= 3;
    }
    return "rgba(" +
        (64 + (colors[0] % 224)) + ", " +
        (64 + (colors[1] % 224)) + ", " +
        (64 + (colors[2] % 224)) + ", 0.85)";
};

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
            omni_app.fire_event("command_focus:toggle_star", {"index":obj.index})
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
        inner_div.innerHTML = obj.as_line();

        var mixins = obj.parse_mixins();
        mixins.forEach((item) => {
            if (item != 'BaseMixin') {
                var tag = this.float_right();
                tag.innerHTML = item;
                tag.style.backgroundColor = color_for_word(item);
                inner_div.appendChild(tag)
            }
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

        return hits.concat(['BaseMixin']);
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

    as_line() {
        return this.parse()['body']
    }
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

    save()     {}
    load(text) {}

    on_archive(event_object, item) {
        item.deleted = true
    }

    on_toggle_star(event_object, item) {
        item.starred = true
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

