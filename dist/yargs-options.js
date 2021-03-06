"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargsOptions = {
    verbose: {
        description: 'Long output',
        type: 'boolean',
    },
    filter: {
        alias: 'f',
        description: 'Filter to apply to command output',
        type: 'string',
    },
    wifi: {
        description: 'Connect adb via wifi',
        type: 'boolean',
    },
    disconnect: {
        alias: 'x',
        description: 'Disconnect device connected via tcpip (wifi)',
        type: 'boolean',
    },
    sid: {
        alias: ['s', 'serialId'],
        description: 'Device serial id',
        type: 'string',
    },
    package: {
        alias: ['pkg'],
        description: 'Set the target application package',
        type: 'string',
    },
    unset: {
        description: 'Unset a value',
        type: 'boolean',
    },
    list: {
        alias: ['l'],
        description: 'Display items',
        type: 'boolean',
    },
    grid: {
        alias: ['g', 'grid', 'grid'],
        description: 'Grid/tabular display',
        type: 'boolean',
    },
    json: {
        alias: ['j', 'json'],
        description: 'JSON display',
        type: 'boolean',
    },
    open: {
        description: 'Open file or resource',
        type: 'boolean'
    }
};
exports.default = yargsOptions;
