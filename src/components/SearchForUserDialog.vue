<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-pa-md" style="min-width: 400px">
            <div class="text-h6">Search for user</div>
            <q-form class="q-gutter-md q-mb-md">
                <q-input
                    v-model="username"
                    label="Find user by username"
                />
            </q-form>

            <q-list>
                <SearchForUserLink
                    v-for="user in users"
                    :key="user.id"
                    :user="user"
                />
            </q-list>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from "quasar";
import { User } from "src/models/chat";
import { computed, onMounted, ref } from "vue";
import SearchForUserLink from "./SearchForUserLink.vue";
import UserService from "src/services/userService";

const username = ref("");
const allUsers = ref<User[]>([]);

const users = computed(() => {
    if (username.value && username.value !== "") {
        return allUsers.value.filter((u) => u.username.toLowerCase().includes(username.value)).slice(0, 5);
    } else {
        return allUsers.value.slice(0, 5);
    }
});

onMounted(async () => {
    allUsers.value = await UserService.getAllUsers();
})

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();
</script>
