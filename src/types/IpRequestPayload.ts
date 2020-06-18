import IpStrategy from '../lib/IpStrategy';

export default interface IpRequestPayload {
    strategy: IpStrategy;
    data: string;
}
