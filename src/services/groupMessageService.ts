import { api } from "src/boot/axios";

export default {
    async getGroupMessages(groupId: number, last: number) {
        return await api.get(`/group-message/group/${groupId}/last/${last}`);
    }
};
