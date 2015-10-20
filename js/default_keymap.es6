// This keymap is a key-combo to event mapping.

var global_active_keymap = {
    'control-c':       'command:cancel',
    'control-s':       'command:search',
    'control-d':       'command:do'
};

var global_passive_keymap = {
    'g':               'command:go',
    'f':               'command:filter'
};

// These events get passed to the top view controller and only
// that view controller.

var mvc_passive_keymap = {
    'shift-,':         'control:move_top',
    'shift-k':         'control:move_up_more',
    'up':              'control:move_up',
    'k':               'control:move_up',

    'shift-.':         'control:move_bottom',
    'shift-j':         'control:move_down_more',
    'down':            'control:move_down',
    'j':               'control:move_down',
    'h':               'control:help',

    'space':           'control:select',
    'x':               'control:select',

    'z':               'control:deselect_all',
    'a':               'control:select_all',

    'y':               'command_multi:archive',
    'u':               'command_multi:return',
    'p':               'command_multi:pull',

    'l':               'command_multi:label',
    'o':               'command_multi:open',
    'i':               'command_multi:info',
    
    '-':               'command_multi:subtract',
    '=':               'command_multi:add',
    '[':               'command_multi:left',
    ']':               'command_multi:right',

    'control-n':       'command_single:next',
    'control-p':       'command_single:prev',
    
    'e':               'command_single:edit',
    'r':               'command_single:reply',
    'enter':           'command_single:open'
};

var mvc_active_keymap = { };
