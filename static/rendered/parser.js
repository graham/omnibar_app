"use strict";

var str_trim = function str_trim(s) {
    return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, "");
};

var action_chars = ["@", // Exclusive group, items can only belong to one @ group.
//    "#",  // Inclusive group, items can have as many #tags as they want.
";", // Type declaration (types can have custom rendering methods).

"$", // Key/Value $key=value, if no value is provided, value = true.
"%", // Internal item key=value, not visible to user, used by system.

"=", // Execute code on render, (evaluated value is echoed but not saved).
"&", // Execute once on creation, (evaluated once on creation).
"^" // Execute code on request, (evaluated on request from system, saved).
];

var search_chars = ["\\", // Exclusive search, exclude matches to this search.
"/", // Absolute inclusive search, include matches only if they match this search.
"+", // Optional inclusive search, include matches that match this search.
":", // fuzzy match, allow partial matches in BODY.
";", // Type match (absolute inclusive)
"$" // Variable Matches
];

var eq_cond_chars = ['<=', '>=', '>', '<', '==', '!=', '='];
var open_range_chars = ["(", "\"", "'", "[", "{", "<"];
var close_range_chars = { "(": ")", "\"": "\"", "'": "'",
    "[": "]", "{": "}", "<": ">" };

function string_to_item(s, match_chars) {
    s += ' ';

    var result = {};
    var body = [];
    var entries = [];
    var buffer = [];
    var exit_char = null;
    var last_char = null;

    for (var i = 0; i < s.length; i++) {
        var chr = s[i];

        if (exit_char != null) {
            if (open_range_chars.indexOf(chr) != -1 && match_chars.indexOf(last_char) != -1) {
                exit_char = close_range_chars[chr] || " ";
            } else if (exit_char == chr) {
                var eq_hit = -1;
                var search_hit = '';

                for (var j = 0; j < eq_cond_chars.length; j++) {
                    var hit = buffer.indexOf(eq_cond_chars[j]);
                    if (hit != -1) {
                        eq_hit = hit;
                        search_hit = eq_cond_chars[j];
                        break;
                    }
                }

                if (eq_hit != -1 && buffer[0] != '=') {
                    entries.push([buffer[0], buffer.slice(1, eq_hit).join(''), buffer.slice(eq_hit, eq_hit + search_hit.length), buffer.slice(eq_hit + search_hit.length, buffer.length).join('')]);
                } else {
                    entries.push([buffer[0], buffer.slice(1).join('')]);
                }
                exit_char = null;
                buffer = [];
            } else {
                buffer.push(chr);
            }
        } else {
            if (match_chars.indexOf(chr) != -1 && s[i + 1] != ' ') {
                exit_char = " ";
                body.push(buffer.join(''));
                buffer = [chr];
            } else {
                buffer.push(chr);
            }
        }
        last_char = chr;
    }

    body.push(buffer.join(''));
    result['body'] = str_trim(body.join(' '));
    result['entries'] = entries;
    return result;
}

function strings_to_vars(s) {
    var result = {};

    for (var i = 0; i < s.length; i++) {
        var item = string_to_item(s[i]);

        for (var j = 0; j < item.entries.length; j++) {
            var obj = item.entries[j];
            var key = obj[1];
            var value = null;

            if (obj.length == 3) {
                value = obj[2];
            }

            if (['%', '@'].indexOf(obj[0]) != -1) {
                // pass
            } else {
                    if (value == null) {
                        if (result[key] == undefined) {
                            result[key] = true;
                        }
                    } else {
                        if (result[key] == undefined) {
                            result[key] = [value];
                        } else {
                            result[key].push(value);
                        }
                    }
                }
        }
    }

    return result;
}

function string_to_query(s, match_chars) {
    var search = [];
    var item = string_to_item(s, match_chars);

    for (var i = 0; i < item.entries.length; i++) {
        var obj = item.entries[i];
        if (obj[0] == '/') {
            search.push(['include', obj[1]]);
        } else if (obj[0] == '\\') {
            search.push(['exclude', obj[1]]);
        } else if (obj[0] == ':') {
            search.push(['fuzzy', obj[1]]);
        } else if (obj[0] == ';') {
            search.push(['type', obj[1]]);
        } else if (obj[0] == '?') {
            search.push(['cond', obj[1]]);
        } else {
            console.log("MISS:" + JSON.stringify(obj));
        }
    }

    search.push(['body', item.body]);

    return search;
}

// var test_strings = [
//     "@graham $key=value",
//     "%id=1 %type=Person $key=value blah blah blah $(asdf)",
//     "%(id=1) @me $(name=Graham Abbott)",
//     "%id=1 Lunch with todd $cost=14.99 $star #food",
//     "%id=2 Lunch with todd cost=(cost) $cost=14.99 $star #food",
//     "=[x(123)] @graham @code",
//     "$project=what testing",
//     "we should do x + y",
//     "%data=({'one':1, 'two':2}) one two three"
// ];

// var search_strings = [
//     "/food \\free :todd",
//     "/asdf /work ;person",
//     ":(person) /#asdf \\#work matcher",
//     "/(#searching tag)",
//     "#tag",
//     ";task $due>=tomorrow",
//     "$project==testing"
// ];

// for (var i in test_strings) {
//     var obj = test_strings[i];
//     var result = string_to_item(obj, action_chars);
//     console.log(" --> " + obj);
//     console.log(result);
//     console.log('--------------------------------------------------------');
// }

// for (var i in search_strings) {
//     var obj = search_strings[i];
//     var result = string_to_query(obj, search_chars);
//     console.log(" --> " + obj);
//     console.log("SEARCH: ");
//     console.log(result);
//     console.log('--------------------------------------------------------');
// }