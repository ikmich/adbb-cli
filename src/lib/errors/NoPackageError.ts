class NoPackageError extends Error {
  constructor() {
    super('No package');
  }
}

export default NoPackageError;
