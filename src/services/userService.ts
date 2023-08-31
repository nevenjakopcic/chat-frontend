import { api } from "src/boot/axios";

export default {
    async getAllUsers() {
        return (await api.get("/user")).data;
    }
}
