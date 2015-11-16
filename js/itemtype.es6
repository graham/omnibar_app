class ItemType {
    constructor() {}

    on_event(etype, event_object) {
        let cb = this['on_' + event_type];
        if (cb != undefined) {
            return cb(event_object);
        } else {
            return this.unhandled_event(event_object);
        }
    }

    unhandled_event(event_object) {}

    basic_render() {
        genie.fs(this.content, this.options);
    }
}

