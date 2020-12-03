"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ifConcat = (source = '', options) => {
    for (let option of options) {
        if (option.c) {
            source += option.s;
        }
    }
    return source;
};
exports.default = ifConcat;
