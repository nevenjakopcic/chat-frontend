<template>
    <q-item
        clickable
        @click="showUserDialog"
        active-class="bg-grey-4 text-blue-7"
    >
        <q-item-section avatar>
            <q-icon name="person" />
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ user.username }}</q-item-label>
            <q-item-label caption>{{ user.lastOnline }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { useQuasar } from "quasar";
import { User } from "src/models/chat";
import UserDialog from "components/UserDialog.vue";

const $q = useQuasar();

function showUserDialog() {
    $q.dialog({
        component: UserDialog,
        componentProps: {
            user: props.user
        }
    });
}

const props = defineProps({
    user: {
        type: Object as PropType<User>,
        required: true
    }
});
</script>
