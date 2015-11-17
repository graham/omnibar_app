'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var extension = function extension(s) {
    return s.substr(s.lastIndexOf('.') + 1);
};

var ResourceManager = (function () {
    function ResourceManager() {
        _classCallCheck(this, ResourceManager);

        this.resources = new Map();
    }

    _createClass(ResourceManager, [{
        key: 'update',
        value: function update(url) {
            this.remove_from_page(url);
            this.add_to_page(url);
        }
    }, {
        key: 'add_to_page',
        value: function add_to_page(url) {
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
    }, {
        key: 'remove_from_page',
        value: function remove_from_page(url) {
            var id = this.resources.get(url);
            if (id) {
                var d = document.getElementById(id);
                document.head.removeChild(d);
            }
        }
    }, {
        key: 'guid',
        value: function guid() {
            var s4 = function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            };
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    }]);

    return ResourceManager;
})();