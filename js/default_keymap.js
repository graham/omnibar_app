// This keymap is a key-combo to event mapping.

var global_passive_keymap = {
    'control-c':'command:cancel',
    
    'control-s':'command:search',
    'control-d':'command:do',
    
    'control-b':'command:before',
    'control-a':'command:after',
    
    'control-q':'special:one',
    'control-w':'special:two'
};

// These events get passed to the top view controller and only
// that view controller.

var omniapp_default_passive_keymap = {
    'shift-k':'control:move_top',
    'up':     'control:move_up',
    'k':      'control:move_up',

    'shift-j':'control:move_bottom',
    'down':   'control:move_down',
    'j':      'control:move_down',

    'space':'control:select',
    'x':    'control:select'
};


var omniapp_default_active_keymap = {
    'control-p':'command:push',
    'control-g':'command:grab',

    'control-l':'command:label',
    'control-y':'command:archive'
};
