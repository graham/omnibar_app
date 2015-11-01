"use strict";

var sum = function sum(s) {
    if (s.length) {
        return parseFloat(s[0]) + sum(s.slice(1));
    } else {
        return 0;
    }
};

var str_trim = function str_trim(s) {
    return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, "");
};

function string_to_item(s) {
    s += ' ';

    var result = {};
    var body = [];
    var entries = [];
    var buffer = [];
    var exit_char = null;
    var last_char = null;

    var open_range_chars = ["(", "\"", "'", "[", "{", "<"];
    var close_range_chars = { "(": ")", "\"": "\"", "'": "'",
        "[": "]", "{": "}", "<": ">" };

    var open_chars = ["@", "!", "#", "$", "%", "=", "&", "+", ":", "\\", ";", "?", "^", "`", "/"];

    for (var i = 0; i < s.length; i++) {
        var chr = s[i];

        if (exit_char != null) {
            if (open_range_chars.indexOf(chr) != -1 && open_chars.indexOf(last_char) != -1) {
                exit_char = close_range_chars[chr] || " ";
            } else if (exit_char == chr) {
                var eq_hit = buffer.indexOf('=');
                if (eq_hit != -1 && buffer[0] != '!') {
                    entries.push([buffer[0], buffer.slice(1, eq_hit).join(''), buffer.slice(eq_hit + 1, buffer.length).join('')]);
                } else {
                    entries.push([buffer[0], buffer.slice(1).join('')]);
                }
                exit_char = null;
                buffer = [];
            } else {
                buffer.push(chr);
            }
        } else {
            if (open_chars.indexOf(chr) != -1 && s[i + 1] != ' ') {
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

function string_to_query(s) {
    var search = [];
    var item = string_to_item(s);

    for (var i = 0; i < item.entries.length; i++) {
        var obj = item.entries[i];

        if (obj[0] == '/') {
            search.push(['include', obj[1]]);
        } else if (obj[0] == '\\') {
            search.push(['exclude', obj[1]]);
        } else if (obj[0] == ':') {
            search.push(['match', obj[1]]);
        } else if (obj[0] == ';') {
            search.push(['type', obj[1]]);
        } else if (obj[0] == '!') {
            search.push(['lambda', obj[1]]);
        }
    }

    search.push(['body', item.body]);
    return search;
}

var test_strings = ["@graham $key=value", "%id=1 %type=Person $key=value blah blah blah !(asdf)", "%(id=1) @me $(name=Graham Abbott)", "%id=1 Lunch with todd $cost=14.99 !star #food", "%id=2 Lunch with todd $cost=14.99 !star #food", "![var x = (i) -> i + 1] ![x(123)] @graham @code", "+project testing", "we should do x + y"];

var search_strings = ["/food \\free :todd", "/asdf /work ;person", ":(person) /#asdf \\#work matcher", "![sort = (i) -> i.created]", "/(#searching tag)", "#tag"];

for (var i in test_strings) {
    var obj = test_strings[i];
    var result = string_to_item(obj);
    console.log(result);
    console.log('--------------------------------------------------------');
}

for (var i in search_strings) {
    var obj = search_strings[i];
    var result = string_to_query(obj);
    console.log("     " + obj);
    console.log(result);
    console.log('--------------------------------------------------------');
}