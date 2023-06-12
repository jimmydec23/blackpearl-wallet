import { Wallet } from "@/scripts/app/wallet";

export class App {
  public wallet: Wallet;

  constructor() {
    this.wallet = new Wallet();
  }
}
