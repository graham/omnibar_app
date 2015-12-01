class LocalItemStorage {
    static key(uid) {
        return uid
    }

    static delete_item(uid) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
            localStorage.removeItem(key)
            resolve()
        })
    }

    static get_item(uid) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
            resolve(localStorage.getItem(key))
        })
    }
    
    static put_item(uid, value) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
            localStorage.setItem(key, value)
            resolve()
        })
    }

    static update_item(uid, new_value) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
            let old_value = localStorage.getItem(key)
            localStorage.setItem(key, value)
            resolve(old_value)
        })
    }

    static batch_get_item(list_of_keys) {
        return new Promise((resolve, reject) => {
            let results = []
            list_of_keys.forEach((uid) => {
                let key = this.key(uid)
                results.push(localStorage.getItem(key))
            })
            resolve(results)
        })
    }

    static batch_write_item(list_of_pairs) {
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

    static scan(options) {
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
                let include_item = key_filter_function(key)
                if (include_item) {
                    try {
                        let item = Item.from_json(temp_value)
                        item.uid = key
                        results.push([key, item])
                    } catch (e) {
                        // pass
                    }
                }
            })
            resolve(results)
        })
    }
}

