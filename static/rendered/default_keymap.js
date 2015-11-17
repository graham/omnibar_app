// This keymap is a key-combo to event mapping.

'use strict';

var global_active_keymap = {
    'control-c': 'command:cancel',
    'control-s': 'command:search'
};

var global_passive_keymap = {
    'shift-/': 'command:search'
};

// These events get passed to the top view controller and only
// that view controller.

var mvc_passive_keymap = {
    'shift-,': 'control:move_top',
    'shift-k': 'control:move_up_more',
    'up': 'control:move_up',
    'k': 'control:move_up',

    'shift-.': 'control:move_bottom',
    'shift-j': 'control:move_down_more',
    'down': 'control:move_down',
    'j': 'control:move_down',

    'h': 'control:help',

    'space': 'control:select',
    'x': 'control:select',

    'z': 'control:deselect_all',
    'a': 'control:select_all',
    '\\': 'control:cycle_sort',
    '`': 'control:show_sources',

    // most common way for users to remove things from
    // the omnibox.
    'y': 'command_multi:archive',
    'u': 'command_multi:return',
    'p': 'command_multi:pull',

    // Unclear best way to use this, will look into it more.
    'l': 'command_multi:label',
    'o': 'command_multi:open',
    'i': 'command_multi:info',

    // Likely something that will be supported by a type.
    '-': 'command_multi:subtract',
    '=': 'command_multi:add',
    '[': 'command_multi:left',
    ']': 'command_multi:right',

    // Lets support defer/bubble/bubble_all features
    'd': 'command_multi:defer',
    'b': 'command_multi:bubble',
    'shift-b': 'command_multi:bubble_all',

    // Used to move around inside a view.
    'control-n': 'command_single:next',
    'control-p': 'command_single:prev',

    // Edit singles, hard to explain but easy to understand.
    'e': 'command_single:edit',
    'r': 'command_single:reply',
    'enter': 'command_single:open',
    's': 'command_single:toggle_star'
};

var mvc_active_keymap = {};

for (var i = 0; i < 10; i++) {
    mvc_passive_keymap['' + i] = 'command_multi:add_tag_' + i;
    mvc_passive_keymap['shift-' + i] = 'command_multi:rem_tag_' + i;
    mvc_passive_keymap['control-' + i] = 'control:search_tag_' + i;
    mvc_passive_keymap['control-shift-' + i] = 'control:negative_search_tag_' + i;
}