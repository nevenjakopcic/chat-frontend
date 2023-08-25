<template>
    <q-layout view="hHh lpr lFf">
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

                <q-toolbar-title> {{"Hello, " + userStore.data?.username + "!"}} </q-toolbar-title>

                <q-btn flat dense round icon="logout" @click="logout" />
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
            <q-list>
                <q-item-label header> Groups </q-item-label>
                <GroupLink
                    v-for="group in groups"
                    :key="group.id"
                    :group="group"
                />

                <q-item-label header> Friends </q-item-label>
                <FriendLink
                    v-for="relationship in relationships"
                    :key="relationship.lastUpdatedAt.toString"
                    :relationship="relationship"
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
import RelationshipService from "../services/relationshipService";
import { onMounted, ref } from "vue";
import { Group, Relationship } from "src/models/chat";
import { useRouter } from "vue-router";
import ROUTE_NAMES from "src/router/routeNames";
import FriendLink from "src/components/FriendLink.vue";

const userStore = useUserStore();
const router = useRouter();

const leftDrawerOpen = ref(false);
const groups = ref<Group[]>([]);
const relationships = ref<Relationship[]>([]);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
    userStore.logout();
    router.push({ name: ROUTE_NAMES.LOGIN });
}

onMounted(async () => {
    groups.value = await GroupService.getAllGroups();
    relationships.value = await RelationshipService.getAllRelationships();
});
</script>
