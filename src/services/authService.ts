import { api } from "src/boot/axios";

export default {
    async login(username: string, password: string) {
        const {
            data: { data }
        } = await api.post("/public/login", {
            username: username,
            password: password
        });
        return data;
    }
};
