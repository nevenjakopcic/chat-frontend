<template>
    <q-item clickable :to="link">
        <q-item-section avatar>
            <q-icon name="person" />
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ otherUser }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup lang="ts">
import { Relationship } from "src/models/chat";
import { useUserStore } from "src/stores/user-store";
import { PropType, computed } from "vue";

const userStore = useUserStore();

const otherUser = computed(() =>
                    props.relationship.user1.id === userStore.data?.id
                    ? props.relationship.user2.username
                    : props.relationship.user1.username
                );

const props = defineProps({
    relationship: {
        type: Object as PropType<Relationship>,
        required: true
    }
});

const link = "/home";
</script>
