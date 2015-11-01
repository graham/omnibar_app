var sum = function(s) {
    if (s.length) {
        return parseFloat(s[0]) + sum(s.slice(1));
    } else {
        return 0;
    }
}
    

var str_trim = function(s) { 
    return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, "");
};

function string_to_item(s) {
    s += ' ';
    
    let result = {};

    let body = [];
    let entries = [];
    let buffer = [];

    let exit_char = null;
    let last_char = null;

    let close_range_chars = {
        "(":")",
        "\"":"\"",
        "'":"'",
        "[":"]",
        "{":"}",
        "<":">"
    };

    let open_range_chars = ["(", "\"", "'",
                            "[", "{", "<"];

    let open_chars = ["@", "!", "#", "$", "%",
                      "=", "&", ";", ":"];

    for(var i=0; i < s.length; i++) {
        var chr = s[i];

        if (exit_char != null) {
            if ( (open_range_chars.indexOf(chr) != -1) &&
                 (open_chars.indexOf(last_char) != -1) ) {
                exit_char = close_range_chars[chr] || " ";
            } else if (exit_char == chr) {
                var eq_hit = buffer.indexOf('=');
                if (eq_hit != -1) {
                    entries.push([buffer[0],
                                  buffer.slice(1, eq_hit).join(''),
                                  buffer.slice(eq_hit+1, buffer.length).join('')
                                 ]);
                } else {
                    entries.push([buffer[0], buffer.slice(1).join('')]);
                }
                exit_char = null;
                buffer = [];
            } else {
                buffer.push(chr);
            }
        } else {
            if (open_chars.indexOf(chr) != -1) {
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
    let result = {};

    for(var i=0; i < s.length; i++) {
        var item = string_to_item(s[i]);

        for(var j=0; j < item.entries.length; j++) {
            var obj = item.entries[j]
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

console.log('hello world');

let test_strings = [
    "@graham $key=value",
    "@graham #this_tag",
    "%id=1 %type=Person $key=value blah blah blah !(asdf)",
    "%id=1 asdf #one #two $cost=123 @graham ![one two three]",
    "%(id=1) @me $(name=Graham Abbott)",
    "%id=1 Lunch with todd $cost=14.99 !star !heavy #food",
    "%id=2 Lunch with todd $cost=14.99 !star !heavy #food",
    "%id=3 Lunch with todd $cost=14.99 !star !heavy #food",
    "%id=4 Lunch with todd $cost=14.99 !star !heavy #food",
    "%id=5 Lunch with todd $cost=14.99 !star !heavy #food",
];

for (var i in test_strings) {
    var obj = test_strings[i];
    var result = string_to_item(obj);
    console.log(result);
    console.log('--------------------------------------------------------');
}

var obj = strings_to_vars(test_strings);
console.log(obj);
console.log(sum(obj['cost']));

