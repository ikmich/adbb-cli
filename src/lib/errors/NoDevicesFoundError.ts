class NoDevicesFoundError extends Error {
    constructor(e: Error) {
        super('No devices/emulators found. Please connect your device via USB and ensure that USB Debugging is enabled');
        this.name = e.name;
        this.stack = e.stack;
    }
}

export default NoDevicesFoundError;
