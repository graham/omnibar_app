class PromiseAccumulator {
    constructor() {
        this.callback_list = []
        this.last_promise = null
    }

    queue(cb) {
        this.callback_list.push(cb)

        if (this.last_promise == null) {
            this.step()
        }
    }

    step() {
        if (this.callback_list.length == 0) {
            return
        }

        var head = this.callback_list[0]
        var rest = this.callback_list.slice(1)
        var _this = this
        this.callback_list = rest

        this.last_promise = new Promise(head)

        this.last_promise.then(() => {
            console.log('done')
            this.last_promise = null
            this.step()
        }, (error) => {
            console.log(error)
            this.last_promise = null
            this.step()
        })
    }
}
