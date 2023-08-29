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

    async leaveGroup(groupId: number | undefined) {
        return (await api.delete(`/group/${groupId}/leave`)).data;
    },

    async promoteToAdmin(groupId: number | undefined, memberId: number) {
        return (await api.put(`/group/${groupId}/promote/${memberId}`));
    },

    async kickFromGroup(groupId: number | undefined, memberId: number) {
        return (await api.delete(`/group/${groupId}/kick/${memberId}`));
    }
};
