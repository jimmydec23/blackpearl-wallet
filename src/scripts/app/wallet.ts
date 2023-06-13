import { PluginApp } from "@/scripts/app/pluginApp";
import * as bipHelper from "@/scripts/wallet/bipHelper";
import { BIP32Node } from "@/scripts/wallet/bip32Node";
import { INetwork, ICoin } from "@/scripts/wallet/interfaces";
import { Child } from "@/scripts/db/wallet";

export class Wallet extends PluginApp {
  async init() {
    if (this.hasInit) {
      return;
    }

    this.loadWallet();

    this.hasInit = true;
  }

  get networks(): INetwork[] {
    const nets = [
      {
        netId: 1,
        name: "Main Ethereum Network",
        label: "mainnet",
        color: "darkseagreen",
        url: "https://mainnet.infura.io/v3/9f28b75fa35c4dc2ae401196993494f5",
        coins: [
          { code: "ETH", address: "", isToken: false, decimals: 18 },
          {
            code: "USDT",
            address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            isToken: true,
            decimals: 18
          },
          {
            code: "DAI",
            address: "0x6b175474e89094c44da98b954eedeac495271d0f",
            isToken: true,
            decimals: 18
          }
        ]
      },
      {
        netId: 11155111,
        name: "Sepolia Test Network",
        label: "sepolia",
        color: "palevioletred",
        url: "https://sepolia.infura.io/v3/9f28b75fa35c4dc2ae401196993494f5",
        coins: [{ code: "ETH", address: "", isToken: false, decimals: 18 }]
      },
      {
        netId: 31337,
        name: "HardHat Node",
        label: "mainnet",
        color: "palevioletred",
        url: "http://127.0.0.1:8545",
        coins: [{ code: "ETH", address: "", isToken: false, decimals: 18 }]
      }
    ];
    return nets;
  }

  loadWallet() {
    const wallet = this.$db.getWallet();
    if (!wallet) {
      this.$router.push({ path: "/create" });
      return;
    }

    const node = bipHelper.genBip32Node(wallet.mnemonic);
    const master = new BIP32Node(node);
    master.isMaster = true;

    const accounts = [master];
    wallet.children.forEach((el: Child) => {
      const child = master.derivePath(el.derivePath);
      child.name = el.name;
      accounts.push(child);
    });

    const currentAcc = accounts[0];

    const currentNet: INetwork = this.networks[0];
    const currentCoin = currentNet.coins[0];

    this.$store.commit("wallet/setMaster", master);
    this.$store.commit("wallet/setAccounts", accounts);
    this.$store.commit("wallet/setCurrentAcc", currentAcc);
    this.$store.commit("wallet/setCurrentCoin", currentCoin);
    this.$store.commit("wallet/setNetworks", this.networks);
    this.$store.commit("wallet/setCurrentNet", currentNet);
  }
}
