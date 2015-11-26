class Bucket {
    constructor(name) {
        this.name = name
    }
}

class InMemoryBucket extends Bucket {
    constructor(name) {
        super(name)
        this.item_dict = {}
    }

    delete_item(uid) {
        return new Promise((resolve, reject) => {
            delete this.item_dict[uid]
            resolve()
        })
    }

    get_item(uid) {
        return new Promise((resolve, reject) => {
            resolve(this.item_dict[uid])
        })
    }
    
    put_item(uid, value) {
        return new Promise((resolve, reject) => {
            this.item_dict[uid] = value
            resolve()
        })
    }

    update_item(uid, new_value) {
        return new Promise((resolve, reject) => {
            let old_value = this.item_dict[uid]
            this.item_dict[uid] = new_value
            resolve(old_value)
        })
    }

    batch_get_item(list_of_keys) {
        return new Promise((resolve, reject) => {
            let results = []
            list_of_keys.forEach((uid) => {
                results.push(this.item_dict[uid])
            })
            resolve(results)
        })
    }

    batch_write_item(list_of_pairs) {
        return new Promise((resolve, reject) => {
            let results = []
            list_of_keys.forEach((item) => {
                let [key, value] = item
                this.item_dict[key] = value
            })
            resolve()
        })
    }

    scan(options) {
        let results = [];
        let filter_function = options['filter'] || () => true

        return new Promise((resolve, reject) => {
            let keys = this.item_dict.keys()
            keys.forEach((key) => {
                let temp_value = this.item_dict[key]
                let include_item = filter_function(temp_value)
                if (include_item) {
                    results.push(temp_value)
                }
            })
            resolve(results)
        })
    }
}

class LocalStorageBucket extends Bucket {
    delete_item(uid) {
        return new Promise((resolve, reject) => {
            localStorage.removeItem(uid)
            resolve()
        })
    }

    get_item(uid) {
        return new Promise((resolve, reject) => {
            resolve(localStorage.getItem(uid))
        })
    }
    
    put_item(uid, value) {
        return new Promise((resolve, reject) => {
            localStorage.setItem(uid, value)
            resolve()
        })
    }

    update_item(uid, new_value) {
        return new Promise((resolve, reject) => {
            let old_value = localStorage.getItem(uid)
            localStorage.setItem(uid, value)
            resolve(old_value)
        })
    }

    batch_get_item(list_of_keys) {
        return new Promise((resolve, reject) => {
            let results = []
            list_of_keys.forEach((uid) => {
                results.push(localStorage.getItem(uid))
            })
            resolve(results)
        })
    }

    batch_write_item(list_of_pairs) {
        return new Promise((resolve, reject) => {
            let results = []
            list_of_keys.forEach((item) => {
                let [key, value] = item
                localStorage.setItem(key, value)
            })
            resolve()
        })
    }

    scan(options) {
        let results = [];
        let filter_function = options['filter'] || () => true

        return new Promise((resolve, reject) => {
            let keys = []
            for (let i = 0, len = localStorage.length; i < len; ++i) {
                keys.push(localStorage.key(i))
            }

            keys.forEach((key) => {
                let temp_value = this.item_dict[key]
                let include_item = filter_function(temp_value)
                if (include_item) {
                    results.push(temp_value)
                }
            })
            resolve(results)
        })
    }
}

class S3StorageBucket extends Bucket {

}
