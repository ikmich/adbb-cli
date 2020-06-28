import {SendHandle, Serializable} from "child_process";

export interface ISpawnCallbacks {
    stdout: (stream: Buffer, data: string) => void;
    stderr: (stream: Buffer, data: string) => void;
    error: (error: Error) => void;
    close: (code: number, signal: NodeJS.Signals) => void;
    exit?: (code: number, signal: NodeJS.Signals) => void;
    message?: (message:Serializable, sendHandle:SendHandle) => void
}