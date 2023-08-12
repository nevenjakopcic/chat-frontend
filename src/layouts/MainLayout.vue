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

                <div>Quasar v{{ $q.version }}</div>
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
import GroupLink from "components/GroupLink.vue";
import GroupService from "../services/groupService"
import { onMounted, ref } from "vue";
import { Group } from "src/components/models";

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}

const groupsList = ref<Group[]>([]);

onMounted(async () => {
    groupsList.value = await GroupService.getAllGroups();
    console.log(groupsList.value);
});
</script>
