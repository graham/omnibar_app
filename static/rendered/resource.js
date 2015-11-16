let extension = s => {
    return s.substr(s.lastIndexOf('.') + 1);
};

class ResourceManager {
    constructor() {
        this.resources = new Map();
    }

    update(url) {
        this.remove_from_page(url);
        this.add_to_page(url);
    }

    add_to_page(url) {
        var uid = this.guid();
        var ext = extension(url);
        var ms = new Date().getTime();

        var resource = null;
        if (ext == 'js') {
            resource = document.createElement('script');
            resource.src = url + '#' + ms;
        } else if (ext == 'css') {
            resource = document.createElement('link');
            resource.href = url;
            resource.rel = 'stylesheet';
            resource.type = 'text/css';
        } else {
            return;
        }

        resource.id = uid;
        this.resources.set(url, uid);
        document.head.appendChild(resource);
    }

    remove_from_page(url) {
        var id = this.resources.get(url);
        if (id) {
            var d = document.getElementById(id);
            document.head.removeChild(d);
        }
    }

    guid() {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}