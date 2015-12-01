// Util.. because... util.

var str_trim = function(s) { 
    return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, "");
};

var startswith = function(s, prefix) {
    if (s.slice(0, prefix.length) == prefix) {
        return true;
    } else {
        return false;
    }
};


var color_for_word = function(word, weight) {
    if (weight == undefined) {
        weight = 0
    }
    var index = 0;
    var colors = [0, 0, 0];
    var bumper = 96
    var mod = 255 - bumper;
    for(var i=0; i < word.length; i++) {
        var ch = word.charCodeAt(i);
        colors[index] += ch * ch * ch
        if (weight == index) {
            colors[index] += ch
        }
        index += 1;
        index %= 3;
    }
    return "rgba(" +
        (bumper + (colors[0] % mod)) + ", " +
        (bumper + (colors[1] % mod)) + ", " +
        (bumper + (colors[2] % mod)) + ", 0.8)";
};

function uuid(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

var randword = () => {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    var buffer = []

    for(var i=0; i < 10; i++) {
        buffer.push(chars.charAt(Math.floor(Math.random() * chars.length)))
    }

    return buffer.join("")
}


let extension = (s) => {
    return s.substr(s.lastIndexOf('.')+1)
}

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
        var ms = (new Date).getTime();

        var resource = null;
        if (ext == 'js') {
            resource = document.createElement('script');
            resource.src = url + '#' + ms;
        } else if (ext == 'css') {
            resource = document.createElement('link');
            resource.href = url;
            resource.rel='stylesheet';
            resource.type='text/css';
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
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}

var addEvent = (function () {
    if (document.addEventListener) {
        return function (el, type, fn) {
            if (el && el.nodeName || el === window) {
                el.addEventListener(type, fn, false);
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        };
    } else {
        return function (el, type, fn) {
            if (el && el.nodeName || el === window) {
                el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        };
    }
})();
