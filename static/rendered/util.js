// Util.. because... util.

"use strict";

var str_trim = function str_trim(s) {
    return s.replace(/^\s+|\s+$/g, "").replace(/^[\n|\r]+|[\n|\r]+$/g, "");
};

var startswith = function startswith(s, prefix) {
    if (s.slice(0, prefix.length) == prefix) {
        return true;
    } else {
        return false;
    }
};

var color_for_word = function color_for_word(word, weight) {
    if (weight == undefined) {
        weight = 0;
    }
    var index = 0;
    var colors = [0, 0, 0];
    var bumper = 96;
    var mod = 255 - bumper;
    for (var i = 0; i < word.length; i++) {
        var ch = word.charCodeAt(i);
        colors[index] += ch * ch * ch;
        if (weight == index) {
            colors[index] += ch;
        }
        index += 1;
        index %= 3;
    }
    return "rgba(" + (bumper + colors[0] % mod) + ", " + (bumper + colors[1] % mod) + ", " + (bumper + colors[2] % mod) + ", 0.8)";
};

function uuid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
};

var randword = function randword() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var buffer = [];

    for (var i = 0; i < 10; i++) {
        buffer.push(chars.charAt(Math.floor(Math.random() * chars.length)));
    }

    return buffer.join("");
};