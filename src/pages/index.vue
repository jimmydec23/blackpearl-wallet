<template>
  <div class="wallet">
    <div class="wallet-main">
      <div class="wallet-main-leftWrap">
        <div class="wallet-main-left">
          <div class="wallet-acc">
            <div class="wallet-acc__name">
              <i class="fas fa-user"></i>
              <span>账号:</span>
              <span>{{ currentAcc.name }}</span>
            </div>
            <div class="wallet-acc__addr">
              <i class="fas fa-address-card"></i>
              <span>地址:</span>
              <span>{{ currentAcc.checksumAddress }}</span>
            </div>
            <div class="wallet-acc__coin">
              <i class="fas fa-coins"></i>
              <span>币种:</span>
              <span>{{ currentCoin.code }}</span>
            </div>
            <div class="wallet-acc__net">
              <i class="fas fa-wifi"></i>
              <span>网络:</span>
              <span>{{ currentNet.name }}</span>
            </div>
          </div>
          <div class="wallet-op">
            <i class="el-icon-setting" @click="handleClickSetting"></i>
            <i class="el-icon-circle-plus-outline" @click="handleClickAdd"></i>
          </div>
        </div>
      </div>
      <div class="wallet-main-rightWrap">
        <div class="wallet-main-right">
          <Card ref="card" />
        </div>
      </div>
    </div>
    <Setting ref="setting" />
    <AddAcc ref="add" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Wallet } from "@/scripts/db/wallet";
import * as bipHelper from "@/scripts/wallet/bipHelper";
import { BIP32Node } from "@/scripts/wallet/bip32Node";
import { ICoin } from "@/scripts/wallet/interfaces";
import { mapState } from "vuex";
import Setting from "@/components/wallet/Setting.vue";
import AddAcc from "@/components/wallet/AddAcc.vue";
import Card from "@/components/wallet/Card.vue";

export default Vue.extend({
  components: { Setting, AddAcc, Card },
  computed: {
    ...mapState({
      accounts: (state: any) => state.wallet.accounts,
      currentAcc: (state: any) => state.wallet.currentAcc,
      currentCoin: (state: any) => state.wallet.currentCoin,
      currentNet: (state: any) => state.wallet.currentNet
    })
  },
  async created() {
    await this.$app.wallet.init();
  },
  methods: {
    handleClickCoin(coin: ICoin) {
      this.currentCoin = coin;
    },
    handleClickSetting() {
      const comp: any = this.$refs.setting;
      comp.show();
    },
    handleClickAdd() {
      const comp: any = this.$refs.add;
      comp.show();
    }
  }
});
</script>

<style lang="postcss" scoped>
.wallet {
  margin: auto;
  width: 900px;
  height: 600px;
  display: flex;
  flex-direction: column;
  &-main {
    flex: 1;
    display: flex;
    overflow: hidden;
    &-leftWrap {
      padding: 20px 0;
      transform: skewY(5deg);
      height: 100%;
      overflow-y: auto;
      width: 300px;
    }
    &-left {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      background: var(--color-extra-light-border);
      border-right: 1px solid var(--color-light-border);
      padding: 10px;
      position: relative;
    }
    &-rightWrap {
      flex: 1;
      height: 100%;
      padding: 32px 0 8px 0;
    }
    &-right {
      width: 100%;
      height: 100%;
      background: var(--color-extra-light-border);
      overflow-y: auto;
    }
  }
  &-op {
    background: var(--color-base-border);
    border-top-right-radius: 10px;
    padding: 5px 20px;
    position: absolute;
    left: 0px;
    bottom: 0px;
    i {
      font-size: 22px;
      cursor: pointer;
      margin-right: 5px;
    }
  }
  &-acc {
    & > div {
      border-bottom: 1px solid var(--color-base-border);
      padding: 15px 0;
      display: flex;
      align-items: center;
      i:nth-child(1) {
        width: 15px;
      }
      span:nth-child(2) {
        margin-left: 5px;
        color: var(--color-primary-text);
      }
      span:nth-child(3) {
        margin-left: 10px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 150px;
        white-space: pre;
      }
    }
  }
}
</style>
