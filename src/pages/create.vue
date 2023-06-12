<template>
  <div class="cw">
    <template v-if="isEmpty">
      <div class="cw-empty">
        <strong @click="createWallet" class="cw-textBtn cw-empty-create"
          >初始化助记词</strong
        >
      </div>
    </template>
    <template v-else-if="isCreated">
      <el-row class="cw-row">
        <el-col
          class="cw-col"
          :span="8"
          v-for="(item, index) in mnemonic"
          :key="index"
        >
          <span class="cw-col-item">{{ item }}</span>
        </el-col>
      </el-row>
      <span class="cw-textBtn" @click="writed">我已抄下助记词!</span>
    </template>
    <template v-else-if="isNeedRecovert">
      <div class="cw-reco">
        <div>
          <h2>请输入助记词进行恢复验证</h2>
          <el-row class="cw-reco-mnemonic">
            <el-col
              class="cw-reco-mnemonic-col"
              :span="8"
              v-for="n in 24"
              :key="n"
            >
              <span :readonly="true">{{ recover[n - 1] }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="cw-reco-op">
          <el-row class="cw-reco-op-row">
            <span
              v-for="(item, index) in shuffleArray"
              :key="index"
              class="cw-reco-op-word"
              @click="chooseWord(item)"
              >{{ item }}</span
            >
          </el-row>
          <el-row class="cw-reco-op-btns">
            <el-button type="primary" @click="match">匹配</el-button>
            <el-button type="warning" @click="forceMatch">强制匹配</el-button>
            <el-button type="danger" @click="matchBack">回退</el-button>
          </el-row>
        </div>
      </div>
    </template>
    <template v-else-if="isNeedEncrypt">
      <div class="cw-encrypt">
        <el-form :inline="true" :model="formData">
          <el-form-item label="密码" prop="passwd">
            <el-input
              v-model="formData.passwd"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="encrypt" :loading="encrypting"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as bipHelper from "@/scripts/wallet/bipHelper";
import { Wallet } from "@/scripts/db/wallet";

interface IData {
  mnemonicRaw: string;
  mnemonic: string[];
  walletState: WalletState;
  recover: string[];
  shuffleArray: string[];
  formData: {
    passwd: string;
  };
  encrypting: boolean;
}

enum WalletState {
  Empty = 1,
  Created,
  NeedRecovert,
  NeedEncrypt,
  Stored
}

export default Vue.extend({
  data(): IData {
    return {
      mnemonicRaw: "",
      mnemonic: [],
      walletState: WalletState.Empty,
      recover: [],
      shuffleArray: [],
      formData: {
        passwd: ""
      },
      encrypting: false
    };
  },
  computed: {
    isEmpty(): boolean {
      return this.walletState === WalletState.Empty;
    },

    isCreated(): boolean {
      return this.walletState === WalletState.Created;
    },

    isNeedRecovert(): boolean {
      return this.walletState === WalletState.NeedRecovert;
    },

    isNeedEncrypt(): boolean {
      return this.walletState === WalletState.NeedEncrypt;
    },

    isStored(): boolean {
      return this.walletState === WalletState.Stored;
    }
  },

  methods: {
    createWallet(): void {
      const str: string = bipHelper.genMnemonic();
      this.mnemonicRaw = str;
      this.mnemonic = str.split(" ");
      this.walletState = WalletState.Created;
    },

    shuffle<T>(array: Array<T>): void {
      for (let i = array.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const itemAtIndex = array[randomIndex];

        array[randomIndex] = array[i];
        array[i] = itemAtIndex;
      }
    },

    writed(): void {
      this.shuffleArray = Object.assign([], this.mnemonic);
      this.shuffle(this.shuffleArray);
      this.walletState = WalletState.NeedRecovert;
    },

    match(): void {
      let matched: boolean = true;
      for (let i: number = 0; i < this.mnemonic.length; i++) {
        if (this.mnemonic[i] !== this.recover[i]) {
          matched = false;
          break;
        }
      }
      if (!matched) {
        this.$message({ message: "助记词不匹配", type: "error" });
        return;
      }

      this.walletState = WalletState.NeedEncrypt;
    },

    chooseWord(word: string): void {
      const index: number = this.shuffleArray.findIndex(
        (e: string) => e === word
      );
      if (index !== -1) {
        this.shuffleArray.splice(index, 1);
      }
      this.recover.push(word);
    },

    matchBack(): void {
      const last = this.recover.pop();
      if (last) {
        this.shuffleArray.push(last);
      }
    },

    forceMatch(): void {
      this.recover = Object.assign([], this.mnemonic);
    },

    encrypt(): void {
      if (!this.formData.passwd) {
        this.$message({ message: "请输入密码", type: "error" });
        return;
      }

      this.encrypting = true;
      const wallet: Wallet = new Wallet();
      wallet.mnemonic = this.mnemonicRaw;
      this.$db.setWallet(wallet);
      this.encrypting = false;
      this.$router.push({ path: "/wallet" });
    }
  }
});
</script>

<style lang="postcss" scoped>
.cw {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #303133;
  position: relative;

  &-empty {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-row {
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  &-col {
    margin: 5px 0;
    display: flex;
    align-items: center;
    height: 40px;
    border: 1px solid #dcdfe6;
    &-item {
      padding: 0px 20px;
    }
  }
  &-textBtn {
    text-decoration: underline;
    cursor: pointer;
  }
  &-word {
    border: 1px solid #dcdfe6;
    padding: 5px 10px;
    margin: 10px;
    cursor: pointer;
  }
  &-encrypt {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-reco {
    display: flex;
    &-mnemonic {
      width: 500px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      &-col {
        margin-top: 10px;
        display: flex;
        align-items: center;
        height: 40px;
        border: 1px solid #dcdfe6;
        span {
          padding: 0px 20px;
        }
      }
    }
    &-op {
      width: 300px;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      background: rgba(0, 0, 0, 0.5);
      padding: 5px 0;
      &-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
      }
      &-word {
        background: #fff;
        border: 1px solid #dcdfe6;
        padding: 5px 10px;
        margin: 10px;
        cursor: pointer;
        &:hover {
          background: var(--color-light-border);
        }
      }
      &-btns {
        margin-top: 20px;
      }
    }
  }
}
</style>
