import { BIP32Interface } from "bip32";
import * as etherUtil from "ethereumjs-util";

const deriveRoot: string = "m/44'/60'/0'/0";
const deriveMax: number = 100000000;

export class BIP32Node {
  public isMaster: boolean;
  private node: BIP32Interface;
  private _name: string;

  constructor(node: BIP32Interface) {
    this.node = node;
    this._name = "";
    this.isMaster = false;
  }

  public get name(): string {
    if (this.isMaster) return "默认账户";
    else return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get publicKey(): string {
    return this.node.publicKey.toString("hex");
  }

  public get privateKey(): Buffer | undefined {
    return this.node.privateKey;
  }

  public get address(): string {
    return etherUtil.pubToAddress(this.node.publicKey, true).toString("hex");
  }

  public get checksumAddress(): string {
    return etherUtil.toChecksumAddress(this.address);
  }

  public randomDerive(): [string, BIP32Node] {
    const index = Math.floor(Math.random() * deriveMax);
    const p = `${deriveRoot}/${index}`;
    const child = this.node.derivePath(p);
    return [p, new BIP32Node(child)];
  }

  public derivePath(p: string): BIP32Node {
    const child = this.node.derivePath(p);
    return new BIP32Node(child);
  }
}
