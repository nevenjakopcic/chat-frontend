<template>
    <q-page class="row items-center justify-evenly">
        <q-btn @click="publish">Hello</q-btn>
    </q-page>
</template>

<script setup lang="ts">
import { Client } from "@stomp/stompjs";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();

const client = new Client({
    brokerURL: "ws://localhost:8080/chat"
});

client.activate();

function publish() {
    client.subscribe("/topic/messages/group/1", (message) => {
        console.log("RECEIVED FROM SERVER: %s", message.body);
    });

    client.publish({
        destination: "/ws/chat/group/1",
        body: JSON.stringify({
            authorId: userStore.data?.id,
            content: "Hello"
        })
    });
}
</script>
