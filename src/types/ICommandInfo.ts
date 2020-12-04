import { ICommandOptions } from './ICommandOptions';

export interface ICommandInfo {
  name: string;
  args: string[];
  options: ICommandOptions;
}
