<template>
    <q-page class="column items-center justify-end">
        <div class="row fit" style="flex-grow: 1">
            <q-scroll-area
                class="q-px-md"
                style="width: calc(100% - 280px); height: calc(100vh - 154px)"
                ref="scrollArea"
            >
                <q-chat-message
                    v-for="(message, key) in messages"
                    :key="key"
                    :text="[message.content]"
                    :sent="isSent(message)"
                    :stamp="message.createdAt.toString()"
                >
                    <template #name>
                        <span
                            @click="showUserDialog(message.authorId)"
                            class="cursor-pointer"
                        >
                            {{ getUsername(message) }}
                        </span>
                    </template>
                </q-chat-message>
            </q-scroll-area>
            <q-list
                style="width: 280px; border-left: solid 1px rgba(0, 0, 0, 0.12)"
            >
                <q-item-label header> Members </q-item-label>
                <MemberLink
                    v-for="member in group?.members"
                    :key="member.id"
                    :group="group"
                    :member="member"
                />
            </q-list>
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
import MemberLink from "src/components/MemberLink.vue";
import UserDialog from "components/UserDialog.vue";
import GroupService from "../services/groupService";
import { Group, Message } from "src/models/chat";
import { useUserStore } from "src/stores/user-store";
import { ref, onMounted, watch, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { QScrollArea } from "quasar";

const $q = useQuasar();
const userStore = useUserStore();
const route = useRoute();
const stomp = new Client({ brokerURL: "ws://localhost:8080/chat" });
const subscriptions: StompSubscription[] = [];

const group = ref<Group>();
const messages = ref<Message[]>([]);
const scrollArea = ref<QScrollArea | null>(null);
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

function showUserDialog(userId: number) {
    const userInDialog = group.value?.members.find((m) => m.id === userId);

    $q.dialog({
        component: UserDialog,
        componentProps: {
            user: userInDialog
        }
    });
}

function sendMessage(message: string) {
    stomp.publish({
        destination: `/ws/chat/group/${group.value?.id}`,
        body: JSON.stringify({
            authorId: userStore.data?.id,
            content: message
        })
    });
}

async function setupConversation(id: number) {
    group.value = await GroupService.getGroupAndMembers(id);

    messages.value = await GroupService.getGroupMessages(id, 20);
    messages.value.sort((a, b) => a.id - b.id);

    const sub = stomp.subscribe(`/topic/messages/group/${id}`, (message) => {
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

        setupConversation(+toParams.id);
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
