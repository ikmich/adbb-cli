"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = exports._fn = exports.isEmpty = exports.arrayContainsAnyOf = exports.arrayContains = exports.removeEndLines = exports.no = exports.yes = void 0;
function yes(o) {
    let b = o !== undefined && o !== null;
    if (b && typeof o === 'string') {
        b = b && o !== '';
    }
    return b;
}
exports.yes = yes;
function no(o) {
    return !yes(o);
}
exports.no = no;
function removeEndLines(s, numLines = 0) {
    if (no(s)) {
        return s;
    }
    function getQualifier() {
        if (numLines > 0) {
            return `{${numLines}}`;
        }
        return '+';
    }
    let regexp = new RegExp(`(\\n|\\r\\n)${getQualifier()}$`);
    // let rex = /(\n|\r\n)+$/;
    return s.replace(regexp, '');
}
exports.removeEndLines = removeEndLines;
function arrayContains(haystack, needle) {
    return haystack.indexOf(needle) > -1;
}
exports.arrayContains = arrayContains;
function arrayContainsAnyOf(haystack, needles) {
    for (let item of haystack) {
        if (haystack.indexOf(item) > -1) {
            return true;
        }
    }
    return false;
}
exports.arrayContainsAnyOf = arrayContainsAnyOf;
function isEmpty(subject) {
    if (no(subject)) {
        return true;
    }
    switch (true) {
        case typeof subject === 'string':
            return no(subject);
        case Array.isArray(subject):
            return subject.length === 0;
        case typeof subject === 'object':
            return Object.keys(subject).length === 0;
        case typeof subject === 'number':
            return subject === 0;
        default:
            return no(subject);
    }
}
exports.isEmpty = isEmpty;
function _fn(f) {
    return f();
}
exports._fn = _fn;
function wait(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
exports.wait = wait;
