class ShellExitError extends Error{
    constructor(code) {
        super(`Exited with code ${code}`);
    }
}
export default ShellExitError;