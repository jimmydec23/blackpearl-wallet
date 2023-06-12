import Vue, { PluginObject } from "vue";
import axios, { AxiosInstance } from "axios";

const config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const axiosInstance: AxiosInstance = axios.create(config);

axiosInstance.interceptors.request.use(
  (reqConfig: any) => reqConfig,
  (error: Error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: any) => response.data,
  (error: Error) => error
);

const plugin: PluginObject<any> = {
  install() {
    Object.defineProperties(Vue.prototype, {
      $axios: {
        get() {
          return axiosInstance;
        }
      }
    });
  }
};

Vue.use(plugin);

export default plugin;
export { axiosInstance };
