import {CommandOptionsType} from "./CommandOptions.type";

export interface CommandInfo {
    name: string;
    args: string[];
    options: CommandOptionsType;
}