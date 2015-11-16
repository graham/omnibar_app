class Beacon {
    constructor() {
        this.obs = {};
        this.to_remove = [];
        this.obs_id = 1;
    }

    next_id() {
        this.obs_id += 1;
        return this.obs_id;
    }

    smart_add(name, o) {
        if (this.obs[name] == undefined) {
            this.obs[name] = [o];
        } else {
            this.obs[name].push(o);
        }
    }

    on(name, cb) {
        var uid = this.next_id();
        this.smart_add(name, [cb, true, uid]);
        return uid;
    }

    once(name, cb) {
        var uid = this.next_id();
        this.smart_add(name, [cb, false, uid]);
        return uid;
    }

    fire(name, options) {
        if (options === undefined) {
            options = {};
        }
        var did_hit = false;
        if (this.obs[name] != undefined) {
            var ll = this.obs[name];
            options['event_name'] = name;
            var args = options;
            var response = this.publish_event_to_list(ll, args);
            this.obs[name] = response[0];
            did_hit = response[1];
        }

        if (did_hit) {
            return true;
        } else {
            return false;
        }
    }

    publish_event_to_list(ll, args) {
        var new_list = [];
        var now_final = false;
        var did_hit = false;

        for (var i = 0; i < ll.length; i += 1) {
            if (this.x_in_list(ll[i][2], this.to_remove)) {
                // pass, either it's not a continue, or it's in the remove list.
                this.to_remove = this.remove_x_from_list(ll[i][2], to_remove);
            } else {
                now_final = ll[i][0].apply(null, [args]);
                did_hit = true;
                if (now_final != false) {
                    if (ll[i][1]) {
                        new_list.push(ll[i]);
                    }
                }
            }
        }
        return [new_list, did_hit];
    }

    remove_x_from_list(x, the_list) {
        var new_list = [];
        for (var i = 0; i < the_list.length; i += 1) {
            if (x != the_list[i]) {
                new_list.push(the_list[i]);
            }
        }
        return new_list;
    }

    x_in_list(x, the_list) {
        var l = the_list.length;
        for (var i = 0; i < l; i += 1) {
            if (x == the_list[i]) {
                return true;
            }
        }
        return false;
    }
}

let SafePromise = Promise;

var Promise = function (fn) {
    return SafePromise(function (resolve, reject) {
        try {
            fn(resolve, reject);
        } catch (e) {
            console.log(e);
            reject();
        }
    });
};