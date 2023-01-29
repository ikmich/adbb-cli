import { SendHandle, Serializable } from 'child_process';

export interface ISpawnCallbacks {
  stdout: (stream: Buffer, data: string) => void;
  stderr: (stream: Buffer, data: string) => void;
  error: (error: Error) => void;
  close: (code: number, signal: NodeJS.Signals) => void;
  exit?: (code: number, signal: NodeJS.Signals) => void;
  message?: (message: Serializable, sendHandle: SendHandle) => void;
}

export interface ICommandOptions {
  verbose?: boolean;
  package?: string;
  alias?: string;
  filter?: string;
  disconnect?: boolean;
  sid?: string;
  unset?: boolean;
  list?: boolean;
  grid?: boolean;
  json?: boolean;
  open?: boolean;
  all?: boolean;
}

export interface ICommandInfo {
  name: string;
  args: string[];
  options: ICommandOptions;
}

export type IpStrategy = 'IP_F_INET_ADDR' | 'IFCONFIG';

export interface IpRequestPayload {
  strategy: IpStrategy;
  data: string;
}

export interface IDeviceInfo {
  sid: string;
  specSheet: string;
  usbId?: string;
  product: string;
  model: string;
  device: string;
  transportId: string;
  state: string;
}

export type CommandActionDef = {
  command: string;
  result: () => Promise<string>
}