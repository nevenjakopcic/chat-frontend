<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="toggleLeftDrawer"
                />

                <q-toolbar-title> Quasar App </q-toolbar-title>

                <q-btn
                    flat
                    dense
                    round
                    icon="logout"
                    @click="logout"
                />
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
            <q-list>
                <q-item-label header> Groups </q-item-label>

                <GroupLink
                    v-for="group in groupsList"
                    :key="group.id"
                    :group="group"
                />
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { useUserStore } from "src/stores/user-store";
import GroupLink from "components/GroupLink.vue";
import GroupService from "../services/groupService";
import { onMounted, ref } from "vue";
import { Group } from "src/models/common";
import { useRouter } from "vue-router";
import ROUTE_NAMES from "src/router/routeNames";

const userStore = useUserStore();
const router = useRouter();

const leftDrawerOpen = ref(false);
const groupsList = ref<Group[]>([]);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
    userStore.logout();
    router.push({ name: ROUTE_NAMES.LOGIN });
}

onMounted(async () => {
    groupsList.value = await GroupService.getAllGroups();
});
</script>
