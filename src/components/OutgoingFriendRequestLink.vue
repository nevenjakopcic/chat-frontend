<template>
    <q-item active-class="bg-grey-4 text-blue-7">
        <q-item-section avatar>
            <q-icon name="person" />
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ relationship.otherUser.username }}</q-item-label>
            <q-item-label caption>{{ "Sent: " + receivedWhen }}</q-item-label>
        </q-item-section>

        <q-item-section top side>
            <q-btn
                @click="cancelFriendRequest"
                flat
                dense
                round
                size="12px"
                color="negative"
                icon="close"
            />
        </q-item-section>
    </q-item>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue";
import { useUserStore } from "src/stores/user-store";
import TimeAgo from "javascript-time-ago";
import { Relationship } from "src/models/chat";
import RelationshipService from "src/services/relationshipService";

const userStore = useUserStore();
const timeAgo = new TimeAgo("en-US");
const receivedWhen = computed(() =>
    timeAgo.format(Date.parse(props.relationship.lastUpdatedAt.toString()))
);

async function cancelFriendRequest() {
    await RelationshipService.cancelFriendRequest(
        props.relationship.otherUser.id
    );
    updateRelationship();
}

async function updateRelationship() {
    await userStore.updateRelationships();
}

const props = defineProps({
    relationship: {
        type: Object as PropType<Relationship>,
        required: true
    }
});
</script>
