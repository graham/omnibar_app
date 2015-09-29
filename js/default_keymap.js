// This keymap is a key-combo to event mapping.
var global_active_keymap = {
    'control-c':'command:cancel',
    'control-s':'command:search',
    'control-d':'command:do'
};

var global_passive_keymap = {
    'control-x b':'command:before',
    'control-x a':'command:after',
    'control-x g':'command:go',

    'control-t':'special:one',
    'control-w':'special:two',

    'g':      'command:go',
    'f':      'command:filter'
};

// These events get passed to the top view controller and only
// that view controller.

var mvc_passive_keymap = {
    'shift-,':'control:move_top',
    'shift-k':'control:move_up_more',
    'up':     'control:move_up',
    'k':      'control:move_up',

    'shift-.':'control:move_bottom',
    'shift-j':'control:move_down_more',
    'down':   'control:move_down',
    'j':      'control:move_down',

    'space':  'control:select',
    'x':      'control:select',

    'p':      'command:prev',
    'n':      'command:next',

    'u':      'command:return',
    'y':      'command:archive',
    'm':      'command:pull',

    'l':      'command:label',
    'o':      'command:open',
    'i':      'command:info',

};

var mvc_active_keymap = {
    'control-p':'command:pull',
    'control-u':'command:return',
    'control-o':'command:open',
    'control-i':'command:info',

    'control-l':'command:label',
    'control-y':'command:archive'
};
