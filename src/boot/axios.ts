import { boot } from "quasar/wrappers";
import axios, { AxiosInstance } from "axios";

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
        config.headers.Authorization =
            "Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJuZXZlbmpha29wY2ljLmhyIiwic3ViIjoiNywgbmVubzMiLCJleHAiOjE2OTI0MDg2MzEsImlhdCI6MTY5MjM3MjYzMSwicm9sZXMiOiIifQ.TlSAmdJyqTAHrE3qoOzMDCdYaAulzBUL7-htU8uUZriGGHTAaP9BKUgaTDf1YxO8CaVkiNq79ipUV40_pqyujYYMM1oL3VGsIql7pmQBKqSKDnNTKI3RHYhs2NDiY11fHA1IG96UqWf-KWGyLlT9Rr7WzzezT4owiqs9kJkN3ZkzHvmK7xAN5M3z9Hz-ZKiGNTEeM53svQ4BJs7EJHB6BtW2ni-9gZ0VNM7T7cfwys6m909yCTTP18Ex7Jn0mJbteJtQ13DYZzuxmNlvzNNcfhj3JTWoaD2ZrYa67Bn1nvPnqIH26nmFnNYG8gAlnIYDJmX6c3gnB5ayI62ZzOLbCSpry_AErs-MOfLSupvo2hBacr8sYxqxyUbAMMyNo_fHem6hnsijB0JMNQHvR17J-808RRqJOPfHlJ2NQq9-ESVFX_ytqI5uPcUo-atnj6FU-3HEIFodcjZa7UX9SnqHVBOpwdHaqTNMRQ7RRDTQq2zH1HAXH8KKW1DMNmkXMQAXnBT70-vjYsgiDYUEmlWLRETfu62fEIa-be2sIvFu6vj62NWCKHWUlJfAQXWRFKT1PMJunFiIaU_B9xyBlzM4Q57y-1Jo5Ww4pMSUUrEyuYXxa0ZjKWAxMxcyeBG9P_hCTK6vJIkwmNHWikG3hXKIp7ey8qPkASM7OnA0ojiX02s";

        return config;
    });
});

export { api };
