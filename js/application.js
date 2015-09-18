/*
Copyright [2015] [Graham Abbott <graham.abbott@gmail.com>]

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

    Beacon.prototype.fire = function(name, options) {
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
    };

    Beacon.prototype.publish_event_to_list = function(ll, args) {
        var new_list = [];
        var now_final = false;
	var did_hit = false;
        
        for(var i = 0; i < ll.length; i += 1) {
            if (x_in_list(ll[i][2], this.to_remove)) {
                // pass, either it's not a continue, or it's in the remove list.
                this.to_remove = remove_x_from_list(ll[i][2], to_remove);
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
    };

    Beacon.prototype.reset = function() {
        this.obs = {};
    };

    return Beacon;
})();

var OmniApplication = (function() {
    var has_function = function(o, f) {
	if (typeof(o[f]) === 'function') {
	    return true;
	} else {
	    return false;
	}
    }

    var Application = function() {
        var _this = this;

        this.view_stack = [];
        this.event_emitter = new Beacon();
        this.kap = new kapture.Stack();
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

    Application.prototype.fire_event = function() {
	var len = this.view_stack.length;
	for(var index=1; index <= len; index++) {
	    var beacon = this.view_stack[len-index].beacon;
	    var result = beacon.fire.apply(beacon, arguments);
	    if (result == true) {
		return true;
	    }
	}
	return false;
    };

    Application.prototype.refresh = function() {
        this.event_emitter.fire('app:render');
    };

    Application.prototype.ready = function(cb) {
        var _this = this;
        $.get('templates/line_item.genie', function(data) {
            _this.env.create_template('line_item', data);
            _this.event_emitter.fire('app:render');
        });
        this.event_emitter.once('app:ready', cb);
    };
    
    Application.prototype.present_view = function(view, options) {
	if (options === undefined) {
	    options = {};
	}

	var view_content = view.render();
	$("#ob-content").html(view_content);
    };

    Application.prototype.push_view = function(view, options) {
	var _this = this;
	var stack_length = _this.view_stack.length;
	var current_view = _this.view_stack[stack_length-1];

	// lets let the current view know we're hiding it.
	if (current_view) {
	    current_view.will_hide_view();
	}

	this.kap.push(view.kap);
	view.will_show_view();

	view.prepare();

	this.view_stack.push(view);
	this.present_view(view, options);

	if (current_view) {
	    current_view.did_hide_view();
	}
	view.did_show_view();
    };

    Application.prototype.pop_view = function(options) {
	var _this = this;

	if (_this.view_stack.length == 1) {
	    // Sorry there must always be a view on the stack.
	    return false;
	} else {
	    var stack_length = _this.view_stack.length;
	    var current_view = _this.view_stack[stack_length-1];
	    var new_view =     _this.view_stack[stack_length-2];

	    // lets let the current view know we're hiding it.
	    
	    current_view.will_hide_view();
	    this.kap.pop();

	    new_view.will_show_view();

	    _this.view_stack.pop();
	    this.present_view(new_view, options);

	    current_view.did_hide_view();
	    new_view.did_show_view();

	    return true;
	}
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

    //
    // Key Commands
    //

    var kap_handler = omni_app.kap.get_root_handler();

    // The all important cancel, this could move to control-c as well.
    kap_handler.add_command('control-g', function() {
        omni_app.event_emitter.fire('cmd:cancel');
    });

    // When you hit enter.
    kap_handler.add_command('enter', function() {
        omni_app.fire_event('cmd:enter');
    });

    kap_handler.add_command('shift-enter', function() {
        omni_app.fire_event('cmd:enter', {'mod':'shift'});
    });

    // Commands for getting to and away from the omnibar.
    kap_handler.add_command('esc', function() {
	$("#ob-input").blur();
    });

    kap_handler.add_passive_command('/', function() {
	$("#ob-input").focus();
    });

    kap_handler.add_command('control-s', function() {
	$("#ob-input").val('search:');
	$("#ob-input").focus();
	return true;
    });

    kap_handler.add_command('control-d', function() {
	$("#ob-input").val('do:');
	$("#ob-input").focus();
	return true;
    });

    kap_handler.add_command('`', function() {
        window.location.reload();
    });

    kap_handler.add_command('control-p', function() {
	var custom_view = new MyView();
	omni_app.push_view(custom_view);
    });

    // Moving the cursor, whatever the controller is.
    var move_down = function() { omni_app.fire_event('control:move_down', {}); };
    kap_handler.add_passive_command('j', move_down);
    kap_handler.add_passive_command('down', move_down);
 
    var move_up = function() { omni_app.fire_event('control:move_up', {}); };
    kap_handler.add_passive_command('k', move_up);
    kap_handler.add_passive_command('up', move_up);

    kap_handler.add_push('control-x');
    
    kap_handler.add_command('control-c', function(term) {
	omni_app.fire_event('cmd:close', {});
    });

    kap_handler.add_command('alt-t', function() {
	omni_app.fire_event('time:update', {'ts':dottime()});
    });
    
    //
    // End of Key Commands 
    //
    
    // listen.
    omni_app.event_emitter.on('app:render', function() {
	var stack_length = omni_app.view_stack.length;
	var current_view = omni_app.view_stack[stack_length-1];
	omni_app.present_view(current_view);
    });

    // Lets get started.
    $(document).ready(function() {
	var hostname = window.location.hostname;
	if (hostname == 'localhost' || hostname == '127.0.0.1') {
	    // pass, easier to understand formatted this way.
	} else {
	    ensure_https();
	}
        omni_app.event_emitter.fire('app:ready', omni_app);
    });
})();
