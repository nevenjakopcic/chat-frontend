import { boot } from "quasar/wrappers";
import axios, { AxiosInstance } from "axios";
import { useUserStore } from "src/stores/user-store";

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
    }
}

const api = axios.create({ baseURL: "http://localhost:8080/api" }); // TODO this should be getting URL from .env file

export default boot(({ app }) => {
    app.config.globalProperties.$axios = axios;
    app.config.globalProperties.$api = api;

    api.interceptors.request.use((config) => {
        const userStore = useUserStore();
        const user = userStore.data;

        config.headers.Authorization = user? `Bearer ${user.token}` : "";

        return config;
    });
});

export { api };
