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
            var item = Item.from_json(localStorage.getItem(key))
            resolve(item)
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
            localStorage.setItem(key, value)
            resolve()
        })
    }

    static keys() {
        return new Promise((resolve, reject) => {
            let keys = []
            for (let i = 0, len = localStorage.length; i < len; ++i) {
                keys.push(localStorage.key(i))
            }
            resolve(keys)
        })
    }
}

class S3Storage {
    static key(uid) {
        return uid
    }

    static delete_item(uid) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
        })
    }

    static get_item(uid) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
            $.get('/storage/get', {key:uid}).then((data) => {
                var item = Item.from_json(data)
                resolve(item)
            })
        })
    }
    
    static put_item(uid, value) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
            $.post('/storage/put', {key:uid, value:value}).then((done) => {
                resolve()
            })
        })
    }

    static update_item(uid, new_value) {
        let key = this.key(uid)
        return new Promise((resolve, reject) => {
            $.post('/storage/put', {key:uid, value:value}).then((done) => {
                resolve()
            })
        })
    }

    static keys() {
        return new Promise((resolve, reject) => {
            let response = []
            let request = $.get('/storage/list').then((data) => {
                let keys = JSON.parse(data)
                keys.forEach((values) => {
                    response.push(values[0])
                })
                resolve(response)
            })
        })
    }
}
