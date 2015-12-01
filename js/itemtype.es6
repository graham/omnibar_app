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
        inner_div.innerHTML = obj.parse()['body']

        var mixins = obj.parse()['mixins']
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

class StorageMixin {
    key(uid) {
        return uid
    }

    on_create(event_object, item) {
        this.put_item(this.key(item.uid), item.text)
    }

    on_update(event_object, item) {
        this.on_create(event_object, item)
    }

    on_delete(event_object, item) {
        console.log('lets delete ' + this.key(item.uid))
        this.delete_item(this.key(item.uid))
        item.archived = true
    }

    delete_item(uid) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
            localStorage.removeItem(key)
            resolve()
        })
    }

    get_item(uid) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
            resolve(localStorage.getItem(key))
        })
    }
    
    put_item(uid, value) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
            localStorage.setItem(key, value)
            resolve()
        })
    }

    update_item(uid, new_value) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
            let old_value = localStorage.getItem(key)
            localStorage.setItem(key, value)
            resolve(old_value)
        })
    }

    batch_get_item(list_of_keys) {
        return new Promise((resolve, reject) => {
            let results = []
            list_of_keys.forEach((uid) => {
                let key = this.key(uid)
                results.push(localStorage.getItem(key))
            })
            resolve(results)
        })
    }

    batch_write_item(list_of_pairs) {
        return new Promise((resolve, reject) => {
            let results = []
            list_of_keys.forEach((item) => {
                let [uid, value] = item
                let key = this.key(uid)
                localStorage.setItem(key, value)
            })
            resolve()
        })
    }

    scan(options) {
        if (options == undefined) { options = {} }
        let results = [];
        let key_filter_function = options['key_filter'] || () => true

        return new Promise((resolve, reject) => {
            let keys = []
            for (let i = 0, len = localStorage.length; i < len; ++i) {
                keys.push(localStorage.key(i))
            }

            keys.forEach((key) => {
                let temp_value = localStorage.getItem(key)
                let include_item = key_filter_function(temp_value)
                if (include_item) {
                    results.push([key, temp_value])
                }
            })
            resolve(results)
        })
    }
}

class BaseMixin extends StorageMixin {
    on_event(etype, event_object, item) {
        let cb = this['on_' + etype];
        if (cb != undefined) {
            return cb.apply(this, [event_object, item])
        } else {
            return this.unhandled_event(etype, event_object)
        }
    }

    unhandled_event(event_object) {
        console.log("Unhandled event " + JSON.stringify(event_object) + " on " + this + ".")
    }

    on_archive(event_object, item) {
        if (item.starred != true) {
            item.archived = true
        }
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
glob_mixins['BaseMixin'] = new BaseMixin()

class ConfigMixin extends BaseMixin {}
glob_mixins['config'] = new ConfigMixin()

