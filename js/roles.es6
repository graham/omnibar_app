class CoreRole {
    on_event(etype, event_object, item) {
        let cb = this['on_' + etype];
        if (cb != undefined) {
            return cb.apply(this, [event_object, item])
        } else {
            return this.unhandled_event.apply(this, [etype, event_object])
        }
    }

    unhandled_event(event_object) {
        console.log("Unhandled event " + JSON.stringify(event_object) + " on " + this + ".")
    }

    render(item, parsed) {
        // pass
    }
}

class StorageRole extends CoreRole {
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

class BaseRole extends StorageRole {
    on_archive(event_object, item) {
        if (item.flagged != true) {
            item.archived = true
        }
    }

    on_toggle_star(event_object, item) {
        if (item.flagged) {
            item.flagged = false
        } else {
            item.flagged = true
        }
    }

    on_open(event_object, item) {
        var body = item.as_line()
        var hit = false

        body.split(' ').forEach((word) => {
            if (word.slice(0, 4) == 'http' && hit == false) {
                window.open(word);
                hit = true;
            }
        })
    }
}

omni_app.register_role('_base', BaseRole)
