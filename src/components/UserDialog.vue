<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card style="min-width: 400px">
            <q-card-section class="bg-green text-white">
                <div class="column" style="justify-content: space-between">
                    <div class="text-h5">{{ user.username }}</div>
                    <div class="text-h6">{{ statusMessage }}</div>
                </div>
                <div class="text-subtitle2">Last seen: {{ lastSeen }}</div>
                <div class="text-subtitle2">User since: {{ userSince }}</div>
            </q-card-section>

            <q-separator v-if="isNotCurrentUser" />

            <q-card-actions v-if="isNotCurrentUser" vertical align="right">
                <q-btn
                    v-if="!relationship"
                    @click="sendFriendRequest"
                    push
                    color="green"
                >
                    Send friend request
                </q-btn>
                <q-btn
                    v-if="relationship?.status === 'SENT_FRIEND_REQUEST'"
                    @click="cancelFriendRequest"
                    push
                    color="red"
                >
                    Cancel friend request
                </q-btn>
                <q-btn
                    v-if="relationship?.status === 'PENDING_FRIEND_REQUEST'"
                    @click="acceptFriendRequest"
                    push
                    color="green"
                >
                    Accept friend request
                </q-btn>
                <q-btn
                    v-if="relationship?.status === 'PENDING_FRIEND_REQUEST'"
                    @click="rejectFriendRequest"
                    push
                    color="red"
                >
                    Reject friend request
                </q-btn>
                <q-btn
                    v-if="relationship?.status === 'FRIEND'"
                    @click="removeFromFriends"
                    push
                    color="red"
                >
                    Remove from friends
                </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from "quasar";
import { PropType, computed, onMounted, ref } from "vue";
import { useUserStore } from "src/stores/user-store";
import { User, Relationship } from "src/models/chat";
import RelationshipService from "src/services/relationshipService";
import TimeAgo from "javascript-time-ago";

const userStore = useUserStore();
const timeAgo = new TimeAgo("en-US");
const lastSeen = ref("");
const userSince = ref("");

const relationship = ref<Relationship | null>(null);

const props = defineProps({
    user: {
        type: Object as PropType<User>,
        required: true
    }
});

const isNotCurrentUser = computed(() => props.user.id !== userStore.data?.id);

const statusMessage = computed(() => {
    switch (relationship.value?.status) {
        case "SENT_FRIEND_REQUEST":
            return "Sent friend request";
        case "PENDING_FRIEND_REQUEST":
            return "Pending friend request";
        case "FRIEND":
            return "Friend";
        default:
            return "";
    }
});

async function sendFriendRequest() {
    await RelationshipService.sendFriendRequest(props.user.id);
    updateRelationship();
}

async function cancelFriendRequest() {
    await RelationshipService.cancelFriendRequest(props.user.id);
    updateRelationship();
}

async function acceptFriendRequest() {
    await RelationshipService.acceptFriendRequest(props.user.id);
    updateRelationship();
}

async function rejectFriendRequest() {
    await RelationshipService.rejectFriendRequest(props.user.id);
    updateRelationship();
}

async function removeFromFriends() {
    await RelationshipService.removeFromFriends(props.user.id);
    updateRelationship();
}

async function updateRelationship() {
    await userStore.updateRelationships();
    relationship.value =
        userStore.relationships.find((r) => r.otherUser.id === props.user.id) ||
        null;
}

onMounted(() => {
    lastSeen.value = timeAgo.format(
        Date.parse(props.user.lastOnline.toString())
    );

    const userSinceDate = new Date(Date.parse(props.user.userSince.toString()));
    userSince.value = userSinceDate.toLocaleDateString("hr-HR");

    relationship.value =
        userStore.relationships.find((r) => r.otherUser.id === props.user.id) ||
        null;
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();
</script>
