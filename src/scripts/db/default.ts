import { Wallet } from "@/scripts/db/wallet";

export class Default {
  public wallet: Wallet;

  constructor() {
    this.wallet = new Wallet();
  }
}
