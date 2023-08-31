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

                    <q-separator />

                    <q-item
                        clickable
                        @click="showSearchForUserDialog"
                        class="text-grey-8"
                    >
                        <q-item-section>
                            <q-item-label>Search for user</q-item-label>
                        </q-item-section>

                        <q-item-section avatar>
                            <q-icon name="person_search" />
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item-label header class="text-bold q-pb-xs">
                        Groups
                    </q-item-label>

                    <GroupLink
                        v-for="group in groups"
                        :key="group.id"
                        :group="group"
                    />

                    <q-item-label header class="text-bold q-pb-xs">
                        Friends
                    </q-item-label>
                    <FriendLink
                        v-for="relationship in friendships"
                        :key="relationship.otherUser.id"
                        :relationship="relationship"
                    />

                    <template v-if="incoming_friend_requests.length">
                        <q-item-label header class="text-bold q-pb-xs">
                            Incoming friend requests
                        </q-item-label>
                        <IncomingFriendRequestLink
                            v-for="relationship in incoming_friend_requests"
                            :key="relationship.otherUser.id"
                            :relationship="relationship"
                        />
                    </template>

                    <template v-if="outgoing_friend_requests.length">
                        <q-item-label header class="text-bold q-pb-xs">
                            Outgoing friend requests
                        </q-item-label>
                        <OutgoingFriendRequestLink
                            v-for="relationship in outgoing_friend_requests"
                            :key="relationship.otherUser.id"
                            :relationship="relationship"
                        />
                    </template>
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
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import ROUTE_NAMES from "src/router/routeNames";
import FriendLink from "src/components/FriendLink.vue";
import IncomingFriendRequestLink from "src/components/IncomingFriendRequestLink.vue";
import OutgoingFriendRequestLink from "src/components/OutgoingFriendRequestLink.vue";
import CreateGroupDialog from "src/components/CreateGroupDialog.vue";
import SearchForUserDialog from "src/components/SearchForUserDialog.vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const userStore = useUserStore();
const router = useRouter();

const leftDrawerOpen = ref(false);
const { groups, relationships } = storeToRefs(userStore);

const friendships = computed(() =>
    relationships.value.filter((r) => r.status === "FRIEND")
);
const incoming_friend_requests = computed(() =>
    relationships.value.filter((r) => r.status === "PENDING_FRIEND_REQUEST")
);
const outgoing_friend_requests = computed(() =>
    relationships.value.filter((r) => r.status === "SENT_FRIEND_REQUEST")
);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}

function showCreateGroupDialog() {
    $q.dialog({
        component: CreateGroupDialog
    });
}

function showSearchForUserDialog() {
    $q.dialog({
        component: SearchForUserDialog
    })
}

function logout() {
    userStore.logout();
    router.push({ name: ROUTE_NAMES.LOGIN });
}
</script>
