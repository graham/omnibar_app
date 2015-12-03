// This keymap is a key-combo to evnet mapping.

'use strict';

var global_active_keymap = {
    'control-c': 'command:cancel',
    'control-s': 'command:search'
};

var global_passive_keymap = {
    'shift-/': 'command:search',
    'shift-1': 'command:apply'
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
    'e': 'control:edit',
    'shift-e': 'control:full_edit',

    'space': 'control:select',
    'x': 'control:select',
    'shift-x': 'control:select_only',

    'z': 'control:deselect_all',
    'a': 'control:select_all',
    '\\': 'control:cycle_sort',
    'shift-\\': 'control:re_sort',
    'f1': 'control:roles_toggle',

    // most common way for users to remove things from
    // the omnibox.
    '`': 'selected:sync',
    'y': 'selected:archive',
    'u': 'selected:return',
    'p': 'selected:pull',

    // Unclear best way to use this, will look into it more.
    'l': 'selected:label',
    'o': 'selected:open',
    'i': 'selected:info',

    // Likely something that will be supported by a type.
    '-': 'selected:subtract',
    '=': 'selected:add',
    '[': 'selected:left',
    ']': 'selected:right',

    // Lets support defer/bubble/bubble_all features
    'd': 'selected:defer',
    'b': 'selected:bubble',
    'shift-b': 'selected:bubble_all',

    // Used to move around inside a view.
    'control-n': 'focused:next',
    'control-p': 'focused:prev',

    // Edit singles, hard to explain but easy to understand.
    'r': 'focused:reply',
    's': 'focused:toggle_flag',
    'v': 'focused:view',
    'n': 'focused:note',

    'control-d': 'selected:delete'
};

var mvc_active_keymap = {};

for (var i = 0; i < 10; i++) {
    mvc_passive_keymap['' + i] = 'selected:add_tag_' + i;
    mvc_passive_keymap['control-' + i] = 'selected:rem_tag_' + i;
}