<template>
    <q-page class="row items-center justify-end">
        <div class="q-pa-md row justify-center">
            <div>
                <q-chat-message
                    v-for="(message, key) in messages"
                    :key="key"
                    :name="getUsername(message)"
                    :text="[message.content]"
                    :sent="isSent(message)"
                    :stamp="message.createdAt.toString()"
                />
            </div>
        </div>
        <q-form @submit="onSubmit" class="q-pa-lg full-width">
            <q-input
                outlined
                ref="input"
                v-model="inputText"
                placeholder="Type a message"
            />
            <q-btn round color="primary" icon="send" type="submit" />
        </q-form>
    </q-page>
</template>

<script setup lang="ts">
import { Client, StompSubscription } from "@stomp/stompjs";
import GroupService from "../services/groupService";
import { Group, Message } from "src/models/chat";
import { useUserStore } from "src/stores/user-store";
import { ref, onMounted, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
const stomp = new Client({brokerURL: "ws://localhost:8080/chat"});
let subscription: StompSubscription | null = null;

const group = ref<Group>();
const messages = ref<Message[]>([]);
const input = ref<HTMLInputElement | null>(null);
const inputText = ref<string>("");

function getUsername(message: Message) {
    const authorId = message.authorId;
    const author = group.value?.members.find((m) => m.id === authorId);

    return author?.username;
}

function isSent(message: Message) {
    return message.authorId === userStore.data?.id;
}

function onSubmit() {
    if (inputText.value.trim().length === 0) return;

    sendMessage(inputText.value);

    inputText.value = "";
    input.value?.focus();
}

function sendMessage(message: string) {
    stomp.publish({
        destination: `/ws/chat/group/${group.value?.id}`,
        body: JSON.stringify({
            authorId: userStore.data?.id,
            content: message
        })
    })
}

async function setupConversation(id: number) {
    group.value = await GroupService.getGroupAndMembers(id);

    messages.value = await GroupService.getGroupMessages(id, 20);
    messages.value.sort((a, b) => a.id - b.id);

    subscription = stomp.subscribe(`/topic/messages/group/${id}`, (message) => {
        const received: Message = JSON.parse(message.body);

        messages.value.push(received);
    });

    input.value?.focus();
}

watch(
    () => route.params,
    async (toParams) => {
        // stomp.unsubscribe(`/topic/messages/group/${fromParams.id}`)
        subscription?.unsubscribe;

        setupConversation(+toParams.id);
    }
);

onMounted(async () => {
    stomp.activate();

    setupConversation(+route.params.id);
});

onUnmounted(() => {
    stomp.deactivate();
})
</script>
