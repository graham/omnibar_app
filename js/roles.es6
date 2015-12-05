class AbstractRole {
    // You should use this if you want to represent an item in a list
    // but it doesnt do any storage.

    on_event(etype, event_object, item) {
        let cb = this['on_' + etype];
        if (cb != undefined) {
            try {
                return cb.apply(this, [event_object, item])
            } catch (e) {
                console.log(" Failed during on_event(" +
                            etype + ") on item => " + this.constructor.name +
                            "\n" + e)
            }
        } else {
            return this.unhandled_event.apply(this, [etype, event_object])
        }
    }

    unhandled_event(etype, event_object) {
        console.log("Unhandled event " + etype + " " +
                    JSON.stringify(event_object) + " on " + this + ".")
    }

    render(parsed, item) {
        // pass
    }
}

class StorageRole extends AbstractRole {
    constructor() {
        super()
        this.storage = LocalItemStorage
    }

    on_create(event_object, item) {
        this.storage.put_item(item.uid, item.as_json())
    }

    on_update(event_object, item) {
        this.on_create(event_object, item)
    }

    on_delete(event_object, item) {
        this.storage.delete_item(item.uid)
        item.set_meta('archived', true)
    }
}

class BaseRole extends StorageRole {
    // Only subclass from here if you plan on storing the item somewhere.
    // If you dont change this.storage it will be stored locally.

    on_archive(event_object, item) {
        if (item.get_meta('flagged') != true) {
            item.set_meta('archived', true)
        }
    }

    on_toggle_flag(event_object, item) {
        if (item.get_meta('flagged') == true) {
            item.set_meta('flagged', false)
        } else {
            item.set_meta('flagged', true)
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

    on_view(event_object, item) {
        this.on_open(event_object, item)
    }

    on_quote(event_object, item) {
        console.log([item.uid, item.as_json()])
    }

    on_sync(event_object, item) {
        console.log('on sync base class')
        this.on_update(event_object, item)
    }
}

omni_app.register_role('_base', BaseRole)

class S3Role extends StorageRole {
    constructor() {
        super()
        this.storage = S3Storage
    }

    on_sync(event_object, item) {
        console.log('start s3 sync')
        // If the user requests a sync, update the local version.
        return new Promise((resolve, reject) => {
            this.storage.get_item(item.uid).then((newItem) => {
                console.log("loading new item from s3")
                item.text = newItem.text
                item.meta = newItem.meta
                resolve()
            })
        })
    }
}

omni_app.register_role('s3', S3Role)
