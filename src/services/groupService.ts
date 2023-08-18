import { api } from "src/boot/axios";

export default {
    async getAllGroups() {
        const {
            data: { data }
        } = await api.get("/group");
        return data;
    },

    async getGroupAndMembers(groupId: number) {
        const {
            data: { data }
        } = await api.get(`/group/${groupId}`);
        return data;
    },

    async getGroupMessages(groupId: number, last: number) {
        const {
            data: { data }
        } = await api.get(`/group/${groupId}/last/${last}`);
        return data;
    }
};
