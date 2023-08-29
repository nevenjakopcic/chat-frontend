import { api } from "src/boot/axios";

export default {
    async getAllGroups() {
        return (await api.get("/group")).data;
    },

    async getGroupAndMembers(groupId: number) {
        return (await api.get(`/group/${groupId}`)).data;
    },

    async getGroupMessages(groupId: number, last: number) {
        return (await api.get(`/group/${groupId}/last/${last}`)).data;
    },

    async kickFromGroup(groupId: number | undefined, memberId: number) {
        return (await api.delete(`/group/${groupId}/kick/${memberId}`));
    }
};
