class NetConfig {
    public ip: string = '';
    public scope: string = '';
    public netInterface: string = '';

    constructor(ip: string, scope: string, netInterface: string) {
        this.ip = ip;
        this.scope = scope;
        this.netInterface = netInterface;
    }
}

export default NetConfig;
