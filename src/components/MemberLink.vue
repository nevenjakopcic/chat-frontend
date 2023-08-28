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
            <q-item-label>{{ member.username }}</q-item-label>
            <q-item-label caption>{{ roleName }}</q-item-label>
        </q-item-section>

        <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
                <q-btn-dropdown
                    v-if="shouldShowDropdown"
                    @click.stop
                    auto-close
                    class="gt-xs"
                    size="12px"
                    flat
                    dense
                    rounded
                    no-icon-animation
                    dropdown-icon="more_vert"
                >
                    <q-list>
                        <q-item
                            clickable
                            v-close-popup
                            @click="promoteToAdmin"
                        >
                            <q-item-section>
                                <q-item-label>Promote to admin</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-item
                            clickable
                            v-close-popup
                            @click="kickFromGroup"
                        >
                            <q-item-section>
                                <q-item-label>Kick from group</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </div>
        </q-item-section>
    </q-item>
</template>

<script setup lang="ts">
import { Member, Group } from "src/models/chat";
import { PropType, computed } from "vue";
import { useQuasar } from "quasar";
import UserDialog from "components/UserDialog.vue";
import { useUserStore } from "src/stores/user-store";

const $q = useQuasar();
const userStore = useUserStore();

const roleName = computed(() => props.member.role.substring(5));
const shouldShowDropdown = computed(() => {
    return props.member.role === "ROLE_MEMBER" && isCurrentUserAdmin;
});

const isCurrentUserAdmin = computed(() => props.group?.members.find((m) => m.id === userStore.data?.id)?.role === "ROLE_ADMIN");

function showUserDialog() {
    $q.dialog({
        component: UserDialog,
        componentProps: {
            user: props.member
        }
    });
}

const props = defineProps({
    group: {
        type: Object as PropType<Group>,
        required: false
    },
    member: {
        type: Object as PropType<Member>,
        required: true
    }
});
</script>
