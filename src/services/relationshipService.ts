import { api } from "src/boot/axios";

export default {
    async getAllRelationships() {
        const {
            data: { data }
        } = await api.get("/relationship/user");
        return data;
    }
}
