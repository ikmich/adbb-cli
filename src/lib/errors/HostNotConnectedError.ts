class HostNotConnectedError extends Error {
  constructor() {
    super('No IP for host. Check that the computer is connected to a network');
  }
}

export default HostNotConnectedError;