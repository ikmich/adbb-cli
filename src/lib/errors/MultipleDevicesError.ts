class MultipleDevicesError extends Error {
    constructor(e: Error) {
        super('More than one device/emulator');
        this.name = e.name;
        this.stack = e.stack;
    }
}

export default MultipleDevicesError;
