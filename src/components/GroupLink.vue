<template>
    <q-item clickable :to="link">
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
import { PropType } from "vue";
import { Group } from "src/models/chat";

const props = defineProps({
    group: {
        type: Object as PropType<Group>,
        required: true
    }
});

const link = "/group/" + props.group.id;
</script>
