// This keymap is a key-combo to event mapping.

var global_active_keymap = {
    'control-c':       'command:cancel',
    'control-s':       'command:search',
};

var global_passive_keymap = {
    'shift-/':         'command:search',
    'shift-1':         'command:apply',
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
    'e':               'control:edit',
    'shift-e':         'control:full_edit',
    
    'space':           'control:select',
    'x':               'control:select',
    'shift-x':         'control:select_only',

    'z':               'control:deselect_all',
    'a':               'control:select_all',
    '\\':              'control:cycle_sort',
    'shift-\\':        'control:re_sort',
    '`':               'control:show_sources',

    // most common way for users to remove things from
    // the omnibox.
    'y':               'command_selected:archive',
    'u':               'command_selected:return',
    'p':               'command_selected:pull',

    // Unclear best way to use this, will look into it more.
    'l':               'command_selected:label',
    'o':               'command_selected:open',
    'i':               'command_selected:info',

    // Likely something that will be supported by a type.
    '-':               'command_selected:subtract',
    '=':               'command_selected:add',
    '[':               'command_selected:left',
    ']':               'command_selected:right',

    // Lets support defer/bubble/bubble_all features
    'd':               'command_selected:defer',
    'b':               'command_selected:bubble',
    'shift-b':         'command_selected:bubble_all',

    // Used to move around inside a view.
    'control-n':       'command_focus:next',
    'control-p':       'command_focus:prev',
    
    // Edit singles, hard to explain but easy to understand.
    'r':               'command_focus:reply',
    's':               'command_focus:toggle_star',
    'v':               'command_focus:view',
    'n':               'command_focus:note',

    'control-d':       'command_selected:delete'
};

var mvc_active_keymap = { };

for(var i=0; i < 10; i++) {
    mvc_passive_keymap['' + i] = 'command_selected:add_tag_' + i;
    mvc_passive_keymap['control-' + i] = 'command_selected:rem_tag_' + i;
}
