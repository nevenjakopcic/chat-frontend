<template>

            <q-chat-message
                :name="message.authorId.toString()"
                :text="[message.content]"
            />

</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import { Message } from "./models";

const clickCount = ref(0);
function increment() {
    clickCount.value += 1;
    return clickCount.value;
}

const props = defineProps({
    message: {
        type: Object as PropType<Message>,
        required: true
    }
});
</script>
