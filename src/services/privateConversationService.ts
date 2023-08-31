import { api } from "src/boot/axios";

export default {
    async getPrivateMessages(otherUserId: number, n: number) {
        return (await api.get(`/private/${otherUserId}/last/${n}`)).data;
    },

    async getPrivateMessagesAfterSpecific(otherUserId: number, n: number, lastMessage: number
    ) {
        return (
            await api.get(`/private/${otherUserId}/last/${n}/after/${lastMessage}`)
        ).data;
    }
};
