/*
Copyright [2014] [Graham Abbott <graham.abbott@gmail.com>]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var Beacon = (function() {
    var x_in_list = function(x, the_list) {
        var l = the_list.length;
        for(var i = 0; i < l; i += 1) {
            if (x == the_list[i]) {
                return true;
            }
        }
        return false;
    };
    
    var remove_x_from_list = function(x, the_list) {
        var new_list = [];
        for(var i = 0; i < the_list.length; i += 1) {
            if (x != the_list[i]) {
                new_list.push(the_list[i]);
            }
        }
        return new_list;
    };

    var Beacon = function() {
        this.obs = {};
        this.to_remove = [];
        this.obs_id = 1;
    };

    Beacon.prototype.next_id = function() {
        this.obs_id += 1;
        return this.obs_id;
    };

    Beacon.prototype.smart_add = function(name, o) {
        if (this.obs[name] == undefined) {
            this.obs[name] = [o];
        } else {
            this.obs[name].push(o);
        }
    };

    Beacon.prototype.on = function(name, cb) {
        var uid = this.next_id();
        this.smart_add(name, [cb, true, uid]);
        return uid;
    };

    Beacon.prototype.once = function(name, cb) {
        var uid = this.next_id();
        this.smart_add(name, [cb, false, uid]);
        return uid;
    };

    Beacon.prototype.fire = function(name) {
        if (this.obs[name] != undefined) {
            var ll = this.obs[name];
            var args = [name].concat(arguments);
            this.obs[name] = this.publish_event_to_list(ll, args);
        }

        if (this.obs['*'] != undefined) {
            var ll = this.obs['*'];
            var args = [name].concat(arguments);
            this.obs['*'] = this.publish_event_to_list(ll, args);
        }
    };

    Beacon.prototype.publish_event_to_list = function(ll, args) {
        var new_list = [];
        var now_final = false;
        
        for(var i = 0; i < ll.length; i += 1) {
            if (x_in_list(ll[i][2], this.to_remove)) {
                // pass, either it's not a continue, or it's in the remove list.
                this.to_remove = remove_x_from_list(ll[i][2], to_remove);
            } else {
                now_final = ll[i][0].apply(null, args);
                if (now_final != false) {
                    if (ll[i][1]) {
                        new_list.push(ll[i]);
                    }    
                }
            }
        }
        return new_list;
    };

    Beacon.prototype.reset = function() {
        this.obs = {};
    };

    var remove = function(uid) {
        this.to_remove.push(uid);
    };

    return Beacon;
})();

var OmniApplication = (function() {
    var Application = function() {
        var _this = this;

        this.view_stack = [];
        this.event_emitter = new Beacon();
        this.kap = new kapture.Kapture();
        this.env = new genie.Environment();
        this.render_flag = 0;
        
        $(window).keydown(function(event) {
            _this.kap.key_down(event);
            if (document.activeElement == $("#ob-input")[0]) {
                setTimeout(function() {
                    _this.event_emitter.fire('app:bar_updated');
                }, 0);
            }
        });
    };

    Application.prototype.refresh = function() {
        this.event_emitter.fire('app:render_list');
    };

    Application.prototype.ready = function(cb) {
        var _this = this;
        $.get('templates/line_item.genie', function(data) {
            _this.env.create_template('line_item', data);
            _this.event_emitter.fire('app:render_list');
        });
        this.event_emitter.once('app:ready', cb);
    };

    Application.prototype.push_view = function(view, options) {

    };

    Application.prototype.pop_view = function(options) {

    };

    return Application;
})();

var omni_app = new OmniApplication();
var omni_app_data = {};
omni_app_data.item_list = [];

(function() {
    var storage = localStorage;
    var str_trim = function(s) { return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, ""); };
    var dottime = function() { return Math.floor((new Date).getTime() / 1000); };
    var dottimem = function() { return Math.floor((new Date).getTime()); };
    var ensure_https = function() {
        if (document.location.href.slice(0, 5) == 'http:') {
            document.location = 'https:' + document.location.href.slice(6);
        }
    };
    
    omni_app_data.timers = {};
    omni_app_data.timers.start = dottime();

    var x_in_list = function(x, the_list) {
        var l = the_list.length;
        for(var i = 0; i < l; i += 1) {
            if (x == the_list[i]) {
                return true;
            }
        }
        return false;
    };

    // Key Commands
    omni_app.kap.add_command('enter', function() {
        omni_app.event_emitter.fire('cmd:enter');
    });
    
    omni_app.kap.add_command('control-g', function() {
        omni_app.event_emitter.fire('cmd:cancel');
    });
    
    omni_app.kap.add_push('control-x');
    omni_app.kap.add_command('control-x control-s', function(term) {
        omni_app.event_emitter.fire('cmd:save');
    });
    
    omni_app.kap.add_command('control-x control-c', function(term) {
        omni_app.event_emitter.fire('cmd:reload');
    });

    // listeners
    omni_app.event_emitter.on('*', function(args) {
        console.log(new Date().toISOString() + " - " +
                    (dottime() - omni_app_data.timers.start) +
                    " - EventLog: " + args);
    });
    
    omni_app.event_emitter.once('cmd:reload', function() {
        window.location.reload();
    });

    omni_app.event_emitter.on('app:render_list', function() {
        $("#ob-content").html("");
        
        var table = document.createElement('table');
        table.className = 'ob-table ob-reset';

        for(var i=0; i < omni_app_data.item_list.length; i++) {
            var obj = omni_app_data.item_list[i];
            var d = document.createElement('tr');
            
            d.className = 'ob-tr';
            d.innerHTML = omni_app.env.render('line_item', obj);
            table.appendChild(d);
        }
        $('#ob-content').append(table);
    });

    // Lets get started.
    $(document).ready(function() {
        omni_app.event_emitter.fire('app:ready', omni_app);
    });
})();
