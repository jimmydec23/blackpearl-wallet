import low from "lowdb";
import LocalStorage from "lowdb/adapters/LocalStorage";
import { Default } from "@/scripts/db/default";
import { Wallet, Child } from "@/scripts/db/wallet";

export class DB {
  private db: low.LowdbSync<any>;

  constructor() {
    const adapter = new LocalStorage("blackpearl_db");
    this.db = low(adapter);

    const dbDefault: Default = new Default();
    this.db.defaults(dbDefault);
  }

  public setWallet(wallet: Wallet) {
    this.db.set("wallet", wallet).write();
  }

  public getWallet(): Wallet | null {
    const data = this.db.get("wallet").value();
    if (!data) {
      return null;
    }
    const wallet: Wallet = new Wallet();
    wallet.mnemonic = data.mnemonic;
    wallet.children = data.children;
    return wallet;
  }

  public addWalletChild(child: Child) {
    const children = this.db.get("wallet.children").value();
    children.push(child);
    this.db.set("wallet.children", children).write();
  }
}
