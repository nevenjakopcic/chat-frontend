<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-pa-md" style="min-width: 400px">
            <div class="text-h6">Create a new group</div>
            <q-form @submit="onSubmit" class="q-gutter-md">
                <q-input
                    v-model="name"
                    label="Group name"
                    lazy-rules
                    :rules="[
                        (val) =>
                            (val && val.length >= 3 && val.length <= 20) ||
                            'Group name must be between 3 and 20 characters long.'
                    ]"
                />

                <div>
                    <q-btn label="Create" type="submit" color="primary" />
                </div>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from "quasar";
import { Group } from "src/models/chat";
import groupService from "src/services/groupService";
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const name = ref("");

async function onSubmit() {
    const group: Group = await groupService.createGroup(name.value);
    userStore.updateGroups();

    router.push(`/group/${group.id}`);
    onDialogHide();
}

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();
</script>
