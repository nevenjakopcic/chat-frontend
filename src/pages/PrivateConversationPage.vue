<template>
    <q-page class="column items-center justify-end">
        <div class="row fit" style="flex-grow: 1">
            <q-scroll-area
                class="q-px-md"
                style="width: 100%; height: calc(100vh - 154px)"
                ref="scrollArea"
            >
                <q-infinite-scroll
                    @load="onLoad"
                    reverse
                    debounce="100"
                    ref="infiniteScroll"
                >
                    <q-chat-message
                        v-for="message in messages"
                        :key="message.id"
                        :text="[message.content]"
                        :sent="isSent(message)"
                        :stamp="message.createdAt.toString()"
                    >
                        <template #name>
                            <span class="text-bold">
                                {{ getUsername(message) }}
                            </span>
                        </template>
                    </q-chat-message>
                </q-infinite-scroll>
            </q-scroll-area>
        </div>

        <q-form class="q-pa-lg full-width">
            <q-input
                outlined
                ref="input"
                v-model="inputText"
                placeholder="Type a message"
            >
                <template #after>
                    <q-btn
                        @click="onSubmit"
                        round
                        color="primary"
                        icon="send"
                        type="submit"
                    />
                </template>
            </q-input>
        </q-form>
    </q-page>
</template>

<script setup lang="ts">
import { Client, StompSubscription } from "@stomp/stompjs";
import PrivateConversationService from "../services/privateConversationService";
import { Message } from "src/models/chat";
import { useUserStore } from "src/stores/user-store";
import { ref, onMounted, watch, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { QScrollArea, QInfiniteScroll } from "quasar";

const userStore = useUserStore();
const route = useRoute();
const stomp = new Client({ brokerURL: "ws://localhost:8080/chat" });
const subscriptions: StompSubscription[] = [];

const messages = ref<Message[]>([]);
const scrollArea = ref<QScrollArea | null>(null);
const infiniteScroll = ref<QInfiniteScroll | null>(null);
const input = ref<HTMLInputElement | null>(null);
const inputText = ref<string>("");

function getUsername(message: Message) {
    const authorId = message.authorId;
    if (authorId === userStore.data?.id) {
        return userStore.data.username
    } else {
        return userStore.relationships.find((r) => r.otherUser.id === authorId)?.otherUser.username;
    }
}

function isSent(message: Message) {
    return message.authorId === userStore.data?.id;
}

async function onLoad(index: unknown, done: () => void) {
    if (!messages.value.length) {
        done();
        return;
    }

    const oldestMessageId = messages.value?.at(0).id;

    const olderMessages: Message[] =
        await PrivateConversationService.getPrivateMessagesAfterSpecific(
            +route.params.id,
            20,
            oldestMessageId
        );
    if (!olderMessages.length) {
        stop();
        return;
    }
    olderMessages.sort((a, b) => a.id - b.id);
    messages.value = olderMessages.concat(messages.value);

    done();
}

function onSubmit() {
    if (inputText.value.trim().length === 0) return;

    sendMessage(inputText.value);

    inputText.value = "";
    input.value?.focus();
}

function sendMessage(message: string) {
    stomp.publish({
        destination: `/ws/chat/private/${+route.params.id}`,
        body: JSON.stringify({
            authorId: userStore.data?.id,
            content: message
        })
    });
}

async function setupConversation(otherUserId: number) {
    messages.value = await PrivateConversationService.getPrivateMessages(otherUserId, 20);
    messages.value.sort((a, b) => a.id - b.id);

    let dest = "";
    if (userStore.data.id < otherUserId) {
        dest = `/topic/messages/private/${userStore.data?.id}/${otherUserId}`;
    } else {
        dest = `/topic/messages/private/${otherUserId}/${userStore.data?.id}`;
    }

    const sub = stomp.subscribe(dest, (message) => {
        const received: Message = JSON.parse(message.body);

        messages.value.push(received);
        nextTick(() => {
            scrollArea.value?.setScrollPosition("vertical", 9999);
        });
    });
    subscriptions.push(sub);

    input.value?.focus();
    nextTick(() => {
        scrollArea.value?.setScrollPosition("vertical", 9999);
    });
}

watch(
    () => route.params,
    async (toParams) => {
        while (subscriptions.length > 0) {
            subscriptions.pop()?.unsubscribe();
        }

        await setupConversation(+toParams.id);
    }
);

onMounted(async () => {
    stomp.activate();

    setupConversation(+route.params.id);
    scrollArea.value?.setScrollPercentage("vertical", 1);
});

onUnmounted(() => {
    stomp.deactivate();
});
</script>
