var str_trim = function(s) { 
    return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, "");
};

var startswith = function(s, prefix) {
    if (s.slice(0, prefix.length) == prefix) {
        return true;
    } else {
        return false;
    }
};
