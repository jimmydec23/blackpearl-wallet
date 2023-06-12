import { Visitor } from "@/scripts/web3/visitor";
import ERC20ABI from "@/assets/contracts/Erc20ABI.json";
import { Transaction } from "ethereumjs-tx";
import { ISignTxInput, ISignTxOutput } from "@/scripts/wallet/interfaces";
import BigNumber from "bignumber.js";

class WalletVisitor extends Visitor {
  private gasLimit: number = 100000;

  public loadErc20Contract(address: string) {
    const contract = new this.web3.eth.Contract(ERC20ABI, address);
    return contract;
  }

  public genEthInput(
    chain: string,
    privKey: Buffer,
    to: string,
    value: BigNumber,
    gasPrice: number,
    nonce: number
  ): ISignTxInput {
    const data = this.web3.utils.stringToHex("");
    const signInput: ISignTxInput = {
      chain,
      to,
      privKey,
      value: value.toNumber(),
      gasPrice,
      nonce,
      data
    };
    return signInput;
  }

  public genErc20Input(
    chain: string,
    privKey: Buffer,
    to: string,
    value: BigNumber,
    contractAddr: string,
    gasPrice: number,
    nonce: number
  ): ISignTxInput {
    const method = "0xa9059cbb";
    const paddedAddr = this.addrTo256Hex(to);
    const valueHex = this.numTo256Hex(value);
    const data = `${method}${paddedAddr}${valueHex}`;
    const signInput: ISignTxInput = {
      chain,
      to: contractAddr,
      privKey,
      value: 0,
      gasPrice,
      nonce,
      data
    };
    return signInput;
  }

  public signTx(input: ISignTxInput): ISignTxOutput {
    const tx = new Transaction(
      {
        to: input.to,
        value: input.value,
        gasPrice: input.gasPrice,
        nonce: input.nonce,
        data: input.data,
        gasLimit: this.gasLimit
      },
      { chain: input.chain }
    );
    tx.sign(input.privKey);
    const signData = "0x" + tx.serialize().toString("hex");
    const txHash = "0x" + tx.hash(true).toString("hex");
    return { signData, txHash };
  }

  /**
   *
   * ERC20 transfer 的输入是256位，需要补0
   */
  public numTo256Hex(val: number | BigNumber): string {
    let str = val.toString(16);
    const padding = 256 / 4 - str.length;
    const zero = "0";
    return zero.repeat(padding) + str;
  }

  public addrTo256Hex(addr: string): string {
    let str = addr.substring(2);
    const padding = 256 / 4 - str.length;
    const zero = "0";
    return zero.repeat(padding) + str;
  }
}

export const visitor = new WalletVisitor();
