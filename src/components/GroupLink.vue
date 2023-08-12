<template>
    <q-item clickable tag="a" target="_blank">
        <q-item-section avatar>
            <q-icon name="group" />
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ group.name }}</q-item-label>
            <q-item-label caption>{{ group.id }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup lang="ts">
import { Group } from "./models";

defineProps<{
    group: Group
}>();
</script>
