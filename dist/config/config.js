"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const config = {
    appCommand: 'adbb',
    environment: process.env.NODE_ENV || 'production',
    isDev: function () {
        return this.environment === 'development';
    },
    isProduction: function () {
        return this.environment === 'production';
    },
    ipRegex: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
    PORT_TCP: 5555,
    PING_COUNT: 10,
    cmd_exec_delay: 200,
    elapsed_mins_show_pkg_notice: 10,
    elapsed_secs_show_pkg_notice: 10,
    storeSchema: {
        [constants_1.STORE_REF_PACKAGE]: {
            type: 'string',
        },
        [constants_1.STORE_LAST_PKG_NOTICE_TIME]: {
            type: 'number',
        },
        [constants_1.STORE_LAST_WIFI_IP]: {
            type: 'string'
        }
    },
};
exports.default = config;
