import { BIP32Node } from "@/scripts/wallet/bip32Node";
import { INetwork, ICoin } from "@/scripts/wallet/interfaces";

class WalletState {
  public master: BIP32Node | null = null;
  public accounts: BIP32Node[] = [];
  public currentAcc: BIP32Node | null = null;
  public currentCoin: ICoin | null = null;
  public networks: INetwork[] = [];
  public currentNet: INetwork | null = null;
}

export default {
  namespaced: true,
  state: new WalletState(),
  mutations: {
    setMaster: (state: WalletState, payload: BIP32Node) => {
      state.master = payload;
    },
    setAccounts: (state: WalletState, payload: BIP32Node[]) => {
      state.accounts = payload;
    },
    setCurrentAcc: (state: WalletState, payload: BIP32Node) => {
      state.currentAcc = payload;
    },
    setCurrentCoin: (state: WalletState, payload: ICoin) => {
      state.currentCoin = payload;
    },
    setNetworks: (state: WalletState, payload: INetwork[]) => {
      state.networks = payload;
    },
    setCurrentNet: (state: WalletState, payload: INetwork) => {
      state.currentNet = payload;
    }
  },
  actions: {}
};
