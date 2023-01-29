class NetConfig {
  public readonly ip: string = '';
  public readonly scope: string = '';
  public readonly netInterface: string = '';

  constructor(ip: string, scope: string, netInterface: string) {
    this.ip = ip;
    this.scope = scope;
    this.netInterface = netInterface;
  }
}

export default NetConfig;
