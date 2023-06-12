import Vue from "vue";
import { DB } from "@/scripts/db/db";

const db = new DB();

const plugin = {
  install() {
    Object.defineProperties(Vue.prototype, {
      $db: {
        get() {
          return db;
        }
      }
    });
  }
};

Vue.use(plugin);

export default db;
