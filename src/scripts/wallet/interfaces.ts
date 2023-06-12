export interface ICoin {
  code: string;
  address: string;
  isToken: boolean;
  decimals: number;
}

export interface INetwork {
  netID: number;
  name: string;
  label: string;
  color: string;
  url: string;
  coins: ICoin[];
}

export interface ISignTxOutput {
  signData: string;
  txHash: string;
}

export interface ISignTxInput {
  chain: string;
  privKey: Buffer;
  to: string;
  value: number;
  gasPrice: number;
  nonce: number;
  data: string;
}
