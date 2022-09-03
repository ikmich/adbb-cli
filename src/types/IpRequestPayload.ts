import IpStrategy from './IpStrategy';

export default interface IpRequestPayload {
  strategy: IpStrategy;
  data: string;
}
