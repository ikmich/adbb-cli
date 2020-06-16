#!/usr/bin/env node
import { CMD_CLEAR, CMD_DEVICES, CMD_PACKAGES, CMD_PKGS, CMD_WIFI } from './lib/constants';

import argsParser from './lib/helpers/args-parser';
import commandDispatcher from './lib/helpers/command-dispatcher';
import yargsOptions from './yargs-options';

import yargs from 'yargs';
import getDevices from "./lib/helpers/get-devices";
import getCliCommandString from "./lib/helpers/get-cli-command-string";

const argv = yargs
    .command(CMD_DEVICES, 'List connected devices')
    .command(CMD_PACKAGES, 'List installed packages')
    .alias(CMD_PKGS, CMD_PACKAGES)
    .command(CMD_WIFI, 'Connect the device via wifi')

    // @ts-ignore
    .options(yargsOptions)

    .command(CMD_CLEAR, 'Clear data for application')
    .options({
        package: {},
    })
    .help().argv;


const commandInfo = argsParser.parse(argv);
commandDispatcher.dispatch(commandInfo).then(() => {});

// getDevices().then(result => {
//     console.log('>> devices output:', result);
// });


// console.log('>> process.argv:', process.argv);
// console.log('>> argv:', argv);

// console.log('>> cli command:', getCliCommandString());