import { api } from "src/boot/axios";

export default {
    async getAllGroups() {
        return (await api.get("/group")).data;
    },

    async getGroupAndMembers(groupId: number) {
        return (await api.get(`/group/${groupId}`)).data;
    },

    async getGroupMessages(groupId: number, n: number) {
        return (await api.get(`/group/${groupId}/last/${n}`)).data;
    },

    async getGroupMessagesAfterSpecific(groupId: number, n: number, lastMessage: number) {
        return (await api.get(`/group/${groupId}/last/${n}/after/${lastMessage}`)).data;
    },

    async createGroup(groupName: string) {
        return (await api.post("/group/create", {
            name: groupName
        })).data;
    },

    async addMember(groupId: number, userId: number) {
        return (await api.post(`/group/${groupId}/add-member/${userId}`));
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
