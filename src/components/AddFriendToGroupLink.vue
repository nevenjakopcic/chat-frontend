<template>
    <q-item clickable @click="addToGroup" active-class="bg-grey-4 text-blue-7">
        <q-item-section avatar>
            <q-icon name="person" />
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ relationship.otherUser.username }}</q-item-label>
            <q-item-label caption>{{ "Last seen: " + lastSeen }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup lang="ts">
import TimeAgo from "javascript-time-ago";
import { Relationship } from "src/models/chat";
import GroupService from "src/services/groupService";
import { PropType, computed } from "vue";

const timeAgo = new TimeAgo("en-US");
const lastSeen = computed(() =>
    timeAgo.format(
        Date.parse(props.relationship.otherUser.lastOnline.toString())
    )
);

async function addToGroup() {
    await GroupService.addMember(
        props.groupId,
        props.relationship.otherUser.id
    );
    emit("change");
}

const emit = defineEmits(["change"]);

const props = defineProps({
    groupId: {
        type: Number,
        required: true
    },
    relationship: {
        type: Object as PropType<Relationship>,
        required: true
    }
});
</script>
