import { api } from "src/boot/axios";

export default {
    async getAllRelationships() {
        return (await api.get("/relationship/user")).data;
    },
    async sendFriendRequest(targetId: number) {
        return (await api.post(`/relationship/friend-request/${targetId}`))
            .status;
    },
    async acceptFriendRequest(requesterId: number) {
        return (
            await api.put(`/relationship/friend-request/accept/${requesterId}`)
        ).status;
    },
    async rejectFriendRequest(requesterId: number) {
        return (
            await api.delete(
                `/relationship/friend-request/reject/${requesterId}`
            )
        ).status;
    },
    async cancelFriendRequest(targetId: number) {
        return (
            await api.delete(`/relationship/friend-request/cancel/${targetId}`)
        ).status;
    },
    async removeFromFriends(friendId: number) {
        return (await api.delete(`/relationship/friend/${friendId}`)).status;
    }
};
