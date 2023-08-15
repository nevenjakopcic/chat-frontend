<template>
    <q-page class="row items-center justify-evenly">
        <div class="q-pa-md row justify-center">
            <div style="width: 100%; max-width: 400px;">
                <conversation-message v-for="message in messages"
                    :key="message.id"
                    :message="message"
                    active
                ></conversation-message>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import ConversationMessage from "components/ConversationMessage.vue";
import GroupService from "../services/groupService";
import { Message } from "components/models";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const messages = ref<Message[]>([]);

async function loadMessages() {
    messages.value = await GroupService.getGroupMessages(+route.params.id, 20);
}

watch(
    () => route.params.id,
    async newId => {
        loadMessages();
    }
)

onMounted(async () => {
    loadMessages();
});
</script>
