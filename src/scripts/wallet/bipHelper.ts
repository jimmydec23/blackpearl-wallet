import * as bip39 from "bip39";
import * as bip32 from "bip32";
import { BIP32Interface } from "bip32";

export const genMnemonic = (): string => bip39.generateMnemonic(256);

export const genBip32Node = (
  mnemonic: string,
  password?: string
): BIP32Interface => {
  const seed: Buffer = bip39.mnemonicToSeedSync(mnemonic, password);
  const node: BIP32Interface = bip32.fromSeed(seed);
  return node;
};
