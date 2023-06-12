<template>
  <el-dialog
    class="add"
    :visible.sync="visible"
    :append-to-body="true"
    width="450px"
    :before-close="hide"
  >
    <div slot="title">添加账户</div>
    <template v-if="!finished">
      <el-form ref="form" class="add-form" label-width="100px">
        <el-form-item prop="name" label="名称:">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="hide">取消</el-button>
        <el-button type="primary" :disabled="!form.name" @click="sure"
          >确定</el-button
        >
      </div>
    </template>
    <template v-else>
      <div class="add-finished">
        <span>路径: {{ derivePath }}</span>
        <span>地址: {{ child.checksumAddress }}</span>
      </div>
      <div slot="footer">
        <el-button type="success" @click="hide">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { BIP32Node } from "@/scripts/wallet/bip32Node";
import { Child } from "@/scripts/db/wallet";

interface IData {
  visible: boolean;
  form: {
    name: string;
  };
  derivePath: string;
  child: BIP32Node | null;
}

export default Vue.extend({
  data(): IData {
    return {
      visible: false,
      form: { name: "" },
      derivePath: "",
      child: null
    };
  },
  computed: {
    ...mapState({
      master: (state: any) => state.wallet.master as BIP32Node
    }),
    finished(): boolean {
      return this.derivePath !== "" && this.child !== null;
    }
  },
  methods: {
    show() {
      this.visible = true;
    },
    hide() {
      this.child = null;
      this.derivePath = "";
      this.form.name = "";
      this.visible = false;
    },
    sure() {
      const [derivePath, child] = this.master.randomDerive();

      const dbChild: Child = new Child();
      dbChild.name = this.form.name;
      dbChild.derivePath = derivePath;
      this.$db.addWalletChild(dbChild);
      this.$app.wallet.loadWallet();

      this.derivePath = derivePath;
      this.child = child;
    }
  }
});
</script>

<style lang="postcss" scoped>
.add {
  &-form {
    .el-input {
      width: 240px;
    }
  }
  &-finished {
    display: flex;
    flex-direction: column;
    span {
      padding: 5px 0;
    }
  }
}
</style>
