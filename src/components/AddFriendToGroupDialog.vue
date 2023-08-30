<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-pa-md" style="min-width: 400px">
            <div class="text-h6">Add friend to group</div>
            <q-form class="q-gutter-md q-mb-md">
                <q-input v-model="username" label="Find friend by username" />
            </q-form>

                <q-list>
                    <FriendLink
                        v-for="relationship in potentialMembers"
                        :key="relationship.otherUser.id"
                        :relationship="relationship"
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
import { PropType, computed, onMounted, ref } from "vue";
import FriendLink from "src/components/FriendLink.vue";

const userStore = useUserStore();
const username = ref("");
const { relationships } = storeToRefs(userStore);

const friendships = computed(() => relationships.value.filter((r) => r.status === "FRIEND"));
const potentialMembers = computed(() =>
    relationships.value.filter((r) => {
        !props.members.some((m) => m.id === r.otherUser.id);
    })
);

const props = defineProps({
    members: {
        type: Object as PropType<Member[]>,
        required: true
    }
});

onMounted(() => {
    console.log(friendships);
})

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();
</script>
