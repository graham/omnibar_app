class Item {
    constructor(init_text) {
        this.meta = {}
        this.text = init_text
        this.uid = null
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
        var mixins = this.parse()['mixins']
        mixins.forEach((m) => {
            var match = glob_mixins[m]
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

    _raw_mixins(mixin_expression) {
        let mixins = []
        let matches = this.text.match(mixin_expression)

        if (matches != undefined) {
            matches.forEach((mixin) => {
                mixins.push(str_trim(mixin.slice(1)))
            })
            return mixins
        } else {
            return []
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
            return {}
        }
    }

    parse() {
        let d = {}
        let mixin_expression = /;(\S+)(?:\s+)? ?/g
        let attr_expression = /\$(?:[\w-]+)(?:=[\w]+|=["`].*["`])? ?/g
        let body = this.text

        // lets parse mixins.
        d['mixins'] = this._raw_mixins(mixin_expression)
        body = body.replace(mixin_expression, '')

        // lets parse attributes
        d['attr'] = this._raw_attrs(attr_expression)
        body = body.replace(attr_expression, '')

        d['body'] = body
        return d
    }

    rev() {
        return ''
    }
}
