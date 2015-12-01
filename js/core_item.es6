class Item {
    constructor(init_text) {
        this.uid = null
        this.meta = {}
        this.text = init_text
        this.dirty = false
    }

    as_json() {
        return JSON.stringify({
            'text':this.text,
            'meta':this.meta
        })
    }

    static from_json(text) {
        let data = JSON.parse(text)
        this.text = data['text']
        this.meta = data['meta']
    }
    
    on_event(etype, event_object) {
        var _this = this;
        var roles = this.parse()['roles']
        roles.forEach((m) => {
            var match = omni_app.roles[m]
            if (match) {
                match.on_event(etype, event_object, _this)
            }
        })
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
            if (exclude_hit == false) {
                return ['_base'].concat(roles)
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
        return this.parse().body
    }
}
