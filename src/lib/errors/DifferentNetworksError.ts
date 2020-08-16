class DifferentNetworksError extends Error {
  constructor() {
    super('Device and host are not on the same network');
  }
}

export default DifferentNetworksError;
