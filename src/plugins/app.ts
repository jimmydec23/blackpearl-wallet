import Vue, { PluginObject } from "vue";
import { App } from "@/scripts/app/app";

const app: App = new App();

const plugin: PluginObject<any> = {
  install() {
    Object.defineProperties(Vue.prototype, {
      $app: {
        get() {
          return app;
        }
      }
    });
  }
};

Vue.use(plugin);

export default app;
