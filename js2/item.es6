class Item {
    constructor(init_text) {
        this.meta = {}
        this.text = init_text
        this.dirty = false
        this.pipeline = new PromiseAccumulator()
    }

    as_json() {
        return JSON.stringify({
            'text':this.text,
            'meta':this.meta
        })
    }

    static from_json(text) {
        console.log("ITEMLOAD: " + text)
        let data = JSON.parse(text)
        let item = new Item('')
        item.text = data['text']
        item.meta = data['meta']
        return item
    }

    on_event_end(etype) {
        console.log('event end -> ' + etype)
    }

    on_event(etype, event_object) {
        var _this = this;
        var roles = this.parse()['roles']
        var return_promises = []
        var new_state = Item.from_json(this.as_json())

        roles.forEach((m) => {
            var match = omni_app.roles[m]
            if (match) {
                this.pipeline.queue((resolve, reject) => {
                    var prom = match.on_event(etype, event_object, new_state, _this)
                    if (prom != undefined) {
                        return_promises.push(prom)
                        prom.then(() => {
                            resolve()
                        }, (error) => {
                            console.log(error)
                        })
                    } else {
                        resolve()
                    }
                })
            }
        })

        var all_promise = Promise.all(return_promises)
        all_promise.then(() => {
            this.meta = new_state.meta
            this.text = new_state.text
            this.dirty = new_state.dirty
            this.on_event_end(etype)
        })
        return all_promise
    }

    get_meta(key) {
        return this.meta[key]
    }
    
    set_meta(key, value) {
        this.dirty = true
        this.meta[key] = value
    }

    set_text(text) {
        this.dirty = true
        this.text = text
    }

    parse() {
        let d = this.clean_parse()

        d['roles'].forEach((role) => {
            if (omni_app.roles[role]) {
                try {
                    omni_app.roles[role].render(d, this)
                } catch (e) {
                    console.log("Role " + role + " failed during render() on item => " + this.constructor.name + "\n" + e)
                }
            }
        })

        return d
    }

    clean_parse() {
        let d = {}
        let role_expression = /;(\S+)(?:\s+)? ?/g
        let attr_expression = /\$(?:[\w-]+)(?:=[\w\/]+|=["`].*["`])? ?/g
        let body = this.text

        // lets parse roles.
        d['roles'] = this._raw_roles(role_expression)
        body = body.replace(role_expression, '')

        // lets parse attributes
        d['attr'] = this._raw_attrs(attr_expression)
        body = body.replace(attr_expression, '')

        d['body'] = body

        return d
    }

    as_line() {
        if (this.dirty) {
            return this.parse().body + "*"
        } else {
            return this.parse().body
        }
    }

    _raw_roles(role_expression) {
        let exclude_hit = false
        let roles = []
        let matches = this.text.match(role_expression)

        if (matches != undefined) {
            matches.forEach((role) => {
                role = str_trim(role)
                if (role == ';;') {
                    exclude_hit = true
                }
                roles.push(role.slice(1))
            })
            if (exclude_hit == false && this.get_meta('is_search_result') != true) {
                return roles.concat(['_base'])
            } else {
                return roles
            }
        } else {
            return ['_base']
        }
    }

    _raw_attrs(attr_expression) {
        let attrs = {}
        let matches = this.text.match(attr_expression)

        if (matches != undefined) {
            matches.forEach((match) => {
                match = match.slice(1)
                if (match.indexOf('=') == -1) {
                    let key = str_trim(match)
                    attrs[key] = true
                } else {
                    let sp = match.split('=')
                    if (sp[1][0] == '`') {
                        let value = sp[1].slice(1, sp[1].length-2)
                        attrs[sp[0]] = JSON.parse(str_trim(value))
                    } else if (sp[1][0] == '"') {
                        attrs[sp[0]] = JSON.parse(str_trim(sp[1]))
                    } else {
                        attrs[sp[0]] = str_trim(sp[1])
                    }
                }
            })
            return attrs
        } else {
            return attrs
        }
    }
}
