import { api } from "src/boot/axios";

export default {
    async login(username: string, password: string) {
        return (
            await api.post("/public/login", {
                username: username,
                password: password
            })
        ).data;
    },

    async register(username: string, password: string, email: string) {
        return (
            await api.post("/public/register", {
                username: username,
                password: password,
                email: email
            })
        ).data;
    }
};
