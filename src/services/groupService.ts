import { api } from "src/boot/axios";

export default {
    async getAllGroups() {
        const {
            data: {data}
        } = await api.get("/group");
        return data;
    }
};
