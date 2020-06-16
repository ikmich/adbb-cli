class DeviceOfflineError extends Error {
    constructor(e: Error) {
        super('Device offline');
        this.name = e.name;
        this.stack = e.stack;
    }
}

export default DeviceOfflineError;
