import { AxiosInstance } from "axios";
import { DB } from "@/scripts/db/db";
import { App } from "@/scripts/app/app";

declare module "vue/types/vue" {
  interface Vue {
    $app: App;
    $db: DB;
    $axios: AxiosInstance;
    $eventBus: any;
  }
}
