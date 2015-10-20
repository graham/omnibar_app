class PluginManager {
    constructor() {
        this.transformers = new Map();
        this.sources = new Map();
        this.item_types = new Map();

        this.default_transformer = null;
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

class ItemType {}
class ItemSource {}

class ItemTransformer {
    constructor() {
        var _this = this;
        this.env = new genie.Environment();
        
        $.get('templates/line_item.genie', (data) => {
            _this.env.create_template('line_item', data);
            omni_app.refresh();
        });
    }
    
    parse(obj, tools) {
        console.log(obj);
        if (this.env.template_dict['line_item'] == undefined) {
            return obj['content'];
        } else {
            return this.env.render('line_item', obj);
        }
    }
}
