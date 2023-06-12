import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/css/default.css";

import "@/plugins/app";
import "@/plugins/element";
import "@/plugins/db";
import "@/plugins/clipboard";
import "@/plugins/axios";
import i18n from "@/plugins/i18n";
import "@/plugins/eventBus";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created() {
    document.body.className = "default";
  }
}).$mount("#app");
