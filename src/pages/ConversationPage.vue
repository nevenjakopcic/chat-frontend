<template>
    <q-page class="row items-center justify-end">
        <div class="q-pa-md row justify-center">
            <div>
                <q-chat-message
                    v-for="(message, key) in messages"
                    :key="key"
                    :name="messageName(message)"
                    :text="[message.content]"
                    :sent="isSent(message)"
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
import GroupService from "../services/groupService";
import { Group, Message } from "src/models/common";
import { useUserStore } from "src/stores/user-store";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();

const group = ref<Group>();
const messages = ref<Message[]>([]);
const input = ref<HTMLInputElement | null>(null);
const inputText = ref<string>("");

async function loadGroupInfoAndMembers(id: number) {
    group.value = await GroupService.getGroupAndMembers(id);
}

function getMember(id: number) {
    return group.value?.members.find((m) => m.id === id);
}

async function loadMessages(id: number) {
    messages.value = await GroupService.getGroupMessages(id, 20);
    messages.value.sort((a, b) => a.id - b.id);
}

function messageName(message: Message) {
    const username = getMember(message.authorId)?.username;
    const date = message.createdAt.toString();

    return `${username} | ${date}`;
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
    console.log(message);
}

watch(
    () => route.params.id,
    async (newId) => {
        loadGroupInfoAndMembers(+route.params.id);
        loadMessages(+newId);
    }
);

onMounted(async () => {
    loadGroupInfoAndMembers(+route.params.id);
    loadMessages(+route.params.id);
    input.value?.focus();
});
</script>
