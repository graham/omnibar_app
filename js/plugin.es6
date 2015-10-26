class PluginManager {
    constructor() {
        this.transformers = new Map();
        this.sources = new Map();
        this.item_types = new Map();

        this.default_transformer = new ItemTransformer();
        this.default_source = null;
        this.default_type = null;
    }

    register_transformer(name, trans) {
        this.transformers.set(name, trans);
    }

    register_source(name, source) {
        this.sources.set(name, source);
    }

    register_type(name, type) {
        this.item_type.set(name, type);
    }
}

class ItemSource {}

class ItemTransformer {
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
        internal_cb.onchange = () => {
            omni_app.fire_event("control:select", {"index":obj.index})
        }

        checkbox_td.appendChild(internal_cb)
        tr.appendChild(checkbox_td)

        return tr
    }
    
    parse(obj, tools) {
        var tr = this.create_base_tr(obj);

        var outer_td = document.createElement('td')
        outer_td.style.cssText = 'width: auto;'

        var star_div = document.createElement('div')
        star_div.className = 'ob-star'
        
        if (obj.starred) {
            star_div.className += ' is_starred'
        } else {
            // boop
        }
        outer_td.appendChild(star_div)
        
        var inner_div = document.createElement('div')
        inner_div.className = 'ob-inner'
        
        var content_div = document.createElement('div')
        content_div.className = 'ob-litem'
        content_div.innerHTML = obj['content']

        inner_div.appendChild(content_div)
        outer_td.appendChild(inner_div)
        tr.appendChild(outer_td)
        
        return tr
    }
}

