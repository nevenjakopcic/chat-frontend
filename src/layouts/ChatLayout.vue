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

                <q-toolbar-title>
                    {{ "Hello, " + userStore.data?.username + "!" }}
                </q-toolbar-title>

                <q-btn flat dense round icon="logout" @click="logout" />
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
            <q-scroll-area style="height: calc(100vh - 50px)">
                <q-list>
                    <q-item-label header class="text-bold q-pb-xs">
                        Groups
                    </q-item-label>
                    <q-item
                        clickable
                        @click="showCreateGroupDialog"
                        class="text-grey-8"
                    >
                        <q-item-section>
                            <q-item-label>Create a new group</q-item-label>
                        </q-item-section>

                        <q-item-section avatar>
                            <q-icon name="group_add" />
                        </q-item-section>
                    </q-item>
                    <GroupLink
                        v-for="group in groups"
                        :key="group.id"
                        :group="group"
                    />

                    <q-item-label header class="text-bold q-pb-xs">
                        Friends
                    </q-item-label>
                    <q-item clickable class="text-grey-8">
                        <q-item-section>
                            <q-item-label>Search for user</q-item-label>
                        </q-item-section>

                        <q-item-section avatar>
                            <q-icon name="person_search" />
                        </q-item-section>
                    </q-item>
                    <FriendLink
                        v-for="relationship in relationships"
                        :key="relationship.otherUser.id"
                        :relationship="relationship"
                    />
                </q-list>
            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { useUserStore } from "src/stores/user-store";
import GroupLink from "components/GroupLink.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import ROUTE_NAMES from "src/router/routeNames";
import FriendLink from "src/components/FriendLink.vue";
import CreateGroupDialog from "src/components/CreateGroupDialog.vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const userStore = useUserStore();
const router = useRouter();

const leftDrawerOpen = ref(false);
const { groups, relationships } = storeToRefs(userStore);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}

function showCreateGroupDialog() {
    $q.dialog({
        component: CreateGroupDialog
    });
}

function logout() {
    userStore.logout();
    router.push({ name: ROUTE_NAMES.LOGIN });
}
</script>
