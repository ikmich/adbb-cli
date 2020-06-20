const yargsOptions = {
    verbose: {
        alias: 'v',
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
        alias: ['p', 'pkg'],
        description: 'Target application package',
        type: 'string',
    },
    unset: {
        description: 'Unset a value',
        type: 'boolean',
    },
    list: {
        alias: ['l'],
        description: 'Display items',
        type: 'boolean'
    }
};

export default yargsOptions;
