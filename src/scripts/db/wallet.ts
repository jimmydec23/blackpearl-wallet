export class Child {
  public name: string = "";
  public derivePath: string = "";
}

export class Wallet {
  public mnemonic: string = "";
  public children: Child[] = [];
}
