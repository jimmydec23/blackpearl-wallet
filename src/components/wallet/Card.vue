<template>
  <div class="ca">
    <div class="ca-card ca-block">
      <div class="ca-card-addr">
        <span>地址:</span>
        <span @click="detail(currentAcc.checksumAddress)">{{
          currentAcc.checksumAddress
        }}</span>
      </div>
      <div class="ca-card-balance">
        <span>余额:</span>
        <span>{{ balance | inBaseUnit(currentCoin.decimals) }} </span>
        <span>{{ currentCoin.code }}</span>
        <i
          class="ca-card-balance__reload"
          type="primary"
          @click="updateInfo"
          :class="[loading ? 'el-icon-loading' : 'el-icon-refresh']"
        ></i>
      </div>
      <div class="ca-card-switch">
        <span>转账:</span>
        <el-switch
          class="ca-card-switch__open"
          active-color="#ebbf58"
          v-model="open"
          @change="handleSwitch"
        ></el-switch>
      </div>
    </div>
    <div class="ca-tran ca-block ca-stick" v-show="open">
      <el-form :model="txForm" label-width="80px" label-position="left">
        <el-form-item label="发送方:" prop="from">
          <el-input v-model="txForm.from" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="接收方:" prop="to">
          <el-input
            v-model="txForm.to"
            placeholder="请输入接收方地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="金额:" prop="value">
          <el-input v-model="txForm.value" placeholder="请输入转账金额">
            <span slot="append">{{ currentCoin.code }}</span>
          </el-input>
        </el-form-item>
        <el-form-item label="Gas Price:">
          <el-input :readonly="true" :value="gasPrice | toGwei">
            <i
              slot="append"
              class="ca-tran__refresh "
              :class="[gsLoading ? 'el-icon-loading' : 'el-icon-refresh']"
              @click="updateGasPrice"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="warning"
            :disabled="!allFill"
            @click="handleSure"
            :loading="sending"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="ca-tx ca-block ca-stick" v-show="open">
      <div class="ca-tx-list">
        <span v-if="signTxs.length === 0">暂无交易信息</span>
        <div v-else v-for="(item, index) in signTxs" :key="index">
          <span>{{ item.txHash }}</span>
          <el-tag
            v-if="isTxConfirm(item.txHash)"
            size="mini"
            effect="plain"
            type="info"
            >已确认</el-tag
          >
          <i v-else class="el-icon-loading"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { visitor } from "@/scripts/wallet/walletVisitor";
import {
  INetwork,
  ICoin,
  ISignTxInput,
  ISignTxOutput
} from "@/scripts/wallet/interfaces";
import { BIP32Node } from "@/scripts/wallet/bip32Node";
import BigNumber from "bignumber.js";

interface IData {
  balance: string;
  loading: boolean;
  gsLoading: boolean;
  sending: boolean;
  open: boolean;
  gasPrice: string;
  signTxs: ISignTxOutput[];
  receipts: any[];
  txForm: {
    from: string;
    to: string;
    value: string;
  };
}

export default Vue.extend({
  data(): IData {
    return {
      balance: "0",
      loading: false,
      gsLoading: false,
      sending: false,
      open: false,
      gasPrice: "",
      signTxs: [],
      receipts: [],
      txForm: {
        from: "",
        to: "",
        value: ""
      }
    };
  },
  computed: {
    ...mapState({
      currentAcc: (state: any) => state.wallet.currentAcc as BIP32Node,
      currentNet: (state: any) => state.wallet.currentNet as INetwork,
      currentCoin: (state: any) => state.wallet.currentCoin as ICoin
    }),
    allFill(): boolean {
      return this.txForm.to !== "" && this.txForm.value !== "";
    }
  },
  filters: {
    inBaseUnit(value: string, decimals: number) {
      return new BigNumber(value).dividedBy(10 ** decimals).toString();
    },
    toGwei(val: string) {
      const gwei = visitor.web3.utils.fromWei(val, "Gwei");
      return gwei + " Gwei";
    }
  },
  watch: {
    currentAcc: function() {
      this.handleChange();
    },
    currentCoin: function() {
      this.handleChange();
    },
    currentNet: function() {
      this.handleChange();
    }
  },

  async created() {
    this.handleChange();
    this.updateGasPrice();
  },

  methods: {
    async handleChange() {
      await this.updatePrivider();
      await this.updateInfo();
    },

    async updateInfo() {
      await this.updateBalance();
    },

    async updatePrivider() {
      this.loading = true;
      const connected = await visitor.setNetwork(this.currentNet.url);
      this.loading = false;
    },

    async updateBalance(isToken: boolean = false) {
      if (!this.currentCoin.isToken) {
        this.loading = true;
        const balance = await visitor.web3.eth.getBalance(
          this.currentAcc.checksumAddress
        );
        this.balance = balance;
        this.loading = false;
      } else {
        this.loading = true;
        const contract = visitor.loadErc20Contract(this.currentCoin.address);
        const balance = await contract.methods
          .balanceOf(this.currentAcc.address)
          .call();
        this.balance = balance;
        this.loading = false;
      }
    },

    async updateGasPrice() {
      this.gsLoading = true;
      this.gasPrice = await visitor.web3.eth.getGasPrice();
      this.gsLoading = false;
    },

    handleSwitch(val: boolean) {
      if (val) {
        this.txForm.from = this.currentAcc.checksumAddress;
      } else {
        this.txForm.to = "";
        this.txForm.value = "";
      }
    },

    async handleSure() {
      if (!this.currentAcc.privateKey) {
        return;
      }

      this.sending = true;

      const value = new BigNumber(this.txForm.value).multipliedBy(
        10 ** this.currentCoin.decimals
      );
      const nonce = await visitor.web3.eth.getTransactionCount(
        this.currentAcc.address,
        "pending"
      );

      const input = this.currentCoin.isToken
        ? visitor.genErc20Input(
            {
              name: this.currentNet.label,
              netId: this.currentNet.netId,
              chainId: this.currentNet.netId
            },
            this.currentAcc.privateKey,
            this.txForm.to,
            value,
            this.currentCoin.address,
            Number(this.gasPrice),
            nonce
          )
        : visitor.genEthInput(
            {
              name: this.currentNet.label,
              netId: this.currentNet.netId,
              chainId: this.currentNet.netId
            },
            this.currentAcc.privateKey,
            this.txForm.to,
            value,
            Number(this.gasPrice),
            nonce
          );
      const signedTx = visitor.signTx(input);

      try {
        const receipt = await visitor.web3.eth.sendSignedTransaction(
          signedTx.signData
        );
        this.signTxs.unshift(signedTx);
        this.receipts.push(receipt);
      } catch (error) {
        var msg: string = "";
        if (error instanceof Error) {
          msg = error.message;
        }
        this.$alert(msg, "Send signed tx", {
          confirmButtonText: "OK"
        });
        console.error("send signed tx error:", error);
      }
      this.sending = false;
    },

    isTxConfirm(tx: string): boolean {
      const target = this.receipts.find((el: any) => {
        return el.transactionHash === tx;
      });
      return target !== undefined;
    },

    detail(address: string) {
      var url: string = "";
      if (this.currentNet.label == "sepolia") {
        url = `https://sepolia.otterscan.io/address/${address}`;
      } else {
        url = `https://cn.etherscan.com/address/${address}`;
      }
      window.open(url, "_blank");
    }
  }
});
</script>

<style lang="postcss" scoped>
.ca {
  padding: 20px 20px 10px 20px;
  &-block {
    padding: 15px 10px;
    position: relative;
    margin-top: 20px;
    background: seagreen;
    width: 450px;
    min-height: 10px;
    color: whitesmoke;
  }
  &-stick {
    &::before {
      position: absolute;
      top: -20px;
      left: 10%;
      content: "";
      width: 10px;
      height: 20px;
      border-left: 10px solid var(--color-stick);
      border-right: 10px solid var(--color-stick);
    }
  }
  &-card {
    margin-top: 0px !important;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &-addr {
      color: whitesmoke;
      span {
        &:nth-child(1) {
          letter-spacing: 2px;
        }
        &:nth-child(2) {
          font-weight: bold;
          margin-left: 30px;
          color: var(--color-balance);
          cursor: pointer;
        }
        &:nth-child(2):hover {
          text-decoration: underline;
        }
      }
    }
    &-balance {
      color: whitesmoke;
      margin-top: 10px;
      display: flex;
      align-items: flex-end;
      span {
        &:nth-child(1) {
          letter-spacing: 2px;
        }
        &:nth-child(2) {
          margin-left: 30px;
          font-size: 20px;
          font-weight: bold;
          color: var(--color-balance);
        }
        &:nth-child(3) {
          margin-left: 10px;
        }
      }
      &__reload {
        margin-left: 20px;
        cursor: pointer;
      }
    }
    &-switch {
      color: whitesmoke;
      margin-top: 10px;
      span {
        &:nth-child(1) {
          letter-spacing: 2px;
        }
      }
      &__open {
        margin-left: 30px;
      }
    }
  }
  &-tran {
    animation: slidein 0.2s;
    &__refresh {
      cursor: pointer;
    }
    & >>> .el-form-item__label {
      color: whitesmoke;
    }
    .el-input {
      width: 300px;
    }
  }
  &-tx {
    animation: slidein 0.2s;

    &-list {
      height: 80px;
      overflow-y: overlay;
      & > div {
        color: whitesmoke;
        padding: 5px 0;
        display: flex;
        align-items: center;
        span {
          &:nth-child(1) {
            display: inline-block;
            width: 300px;
            overflow: hidden;
            margin-left: 10px;
            text-overflow: ellipsis;
          }
          &:nth-child(2) {
            margin-left: 10px;
          }
        }
      }
    }
  }
}

.ca-tx-list::-webkit-scrollbar {
  width: 3px;
}
.ca-tx-list::-webkit-scrollbar-track {
}
.ca-tx-list::-webkit-scrollbar-thumb {
  background: var(--color-balance);
  border-radius: 20%;
}

@keyframes slidein {
  from {
    opacity: 0;
    transform: translateY(-100px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
