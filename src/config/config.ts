import {STORE_LAST_PKG_NOTICE_TIME, STORE_LAST_WIFI_IP, STORE_REF_PACKAGE} from '../constants';

const config = {
    environment: process.env.NODE_ENV || 'production',

    isDev: function() {
        return this.environment === 'development';
    },

    isProduction: function() {
        return this.environment === 'production';
    },

    ipRegex: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,

    cmd_exec_delay: 200,

    elapsed_mins_show_pkg_notice: 10,

    elapsed_secs_show_pkg_notice: 10,

    storeSchema: {
        [STORE_REF_PACKAGE]: {
            type: 'string',
        },
        [STORE_LAST_PKG_NOTICE_TIME]: {
            type: 'number',
        },
        [STORE_LAST_WIFI_IP]: {
            type: 'string'
        }
    },
};

export default config;
