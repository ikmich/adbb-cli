class UndefinedNetworkConfigError extends Error {
    constructor() {
        super('Undefined network config');
    }
}

export default UndefinedNetworkConfigError;