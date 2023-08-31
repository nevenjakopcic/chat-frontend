<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-pa-md" style="min-width: 400px">
            <div class="text-h6">Add friend to group</div>
            <q-form class="q-gutter-md q-mb-md">
                <q-input v-model="username" label="Find friend by username" />
            </q-form>

                <q-list>
                    <AddFriendToGroupLink
                        v-for="relationship in potentialMembers"
                        :key="relationship.otherUser.id"
                        :group-id="groupId"
                        :relationship="relationship"
                        @change="onChange()"
                    />
                </q-list>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDialogPluginComponent } from "quasar";
import { Member } from "src/models/chat";
import { useUserStore } from "src/stores/user-store";
import { PropType, computed, ref } from "vue";
import AddFriendToGroupLink from "src/components/AddFriendToGroupLink.vue";

const userStore = useUserStore();
const username = ref("");
const { relationships } = storeToRefs(userStore);

const friendships = computed(() => relationships.value.filter((r) => r.status === "FRIEND"));
const potentialMembers = computed(() => {
    const memberIds = props.members.map((m) => m.id);
    if (username.value && username.value !== "") {
        return friendships.value.filter((f) => !memberIds.includes(f.otherUser.id)
               && f.otherUser.username.includes(username.value));
    }

    return friendships.value.filter((f) => !memberIds.includes(f.otherUser.id));
});

function onChange() {
    props.callback();
    onDialogHide();
}

const props = defineProps({
    groupId: {
        type: Number,
        required: true
    },
    members: {
        type: Object as PropType<Member[]>,
        required: true
    },
    callback: {
        type: Function,
        required: true
    }
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();
</script>
