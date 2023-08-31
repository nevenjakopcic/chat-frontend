<template>
    <q-page class="column items-center justify-end">
        <div class="row fit" style="flex-grow: 1">
            <q-scroll-area
                class="q-px-md"
                style="width: calc(100% - 280px);
                       height: calc(100vh - 154px)"
                ref="scrollArea"
            >
                <q-infinite-scroll
                    @load="onLoad"
                    reverse
                    debounce=100
                    ref="infiniteScroll"
                >
                    <q-chat-message
                        v-for="message in messages"
                        :key="message.id"
                        :text="[message.content]"
                        :sent="isSent(message)"
                        :stamp="message.createdAt.toString()"
                    >
                        <template #name>
                            <span
                                @click="showUserDialog(message.authorId)"
                                class="cursor-pointer text-bold"
                            >
                                {{ getUsername(message) }}
                            </span>
                        </template>
                    </q-chat-message>
                </q-infinite-scroll>
            </q-scroll-area>

            <q-scroll-area
                style="width: 280px;
                       height: calc(100vh - 154px)"
            >
                <q-list>
                    <q-item
                        clickable
                        @click="showAddFriendToGroupDialog"
                        class="text-grey-8"
                    >
                        <q-item-section>
                            <q-item-label>Add friend to group</q-item-label>
                        </q-item-section>

                        <q-item-section avatar>
                            <q-icon name="person_add_alt_1" />
                        </q-item-section>
                    </q-item>

                <q-separator />

                    <q-item
                        clickable
                        @click="leaveGroup"
                        class="text-grey-8"
                    >
                        <q-item-section>
                            <q-item-label>Leave group</q-item-label>
                        </q-item-section>

                        <q-item-section avatar>
                            <q-icon name="exit_to_app" />
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item-label header> Members </q-item-label>
                    <MemberLink
                        v-for="member in group?.members"
                        :key="member.id"
                        :group="group"
                        :member="member"
                        @change="updateGroup"
                    />
                </q-list>
            </q-scroll-area>
        </div>

        <q-form class="q-pa-lg full-width">
            <q-input
                outlined
                ref="input"
                v-model="inputText"
                placeholder="Type a message"
            >
                <template #after>
                    <q-btn
                        @click="onSubmit"
                        round
                        color="primary"
                        icon="send"
                        type="submit"
                    />
                </template>
            </q-input>
        </q-form>
    </q-page>
</template>

<script setup lang="ts">
import { Client, StompSubscription } from "@stomp/stompjs";
import MemberLink from "src/components/MemberLink.vue";
import UserDialog from "components/UserDialog.vue";
import GroupService from "../services/groupService";
import { Group, Message } from "src/models/chat";
import { useUserStore } from "src/stores/user-store";
import { ref, onMounted, watch, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { QScrollArea, QInfiniteScroll } from "quasar";
import ROUTE_NAMES from "src/router/routeNames";
import AddFriendToGroupDialog from "src/components/AddFriendToGroupDialog.vue";

const $q = useQuasar();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const stomp = new Client({ brokerURL: "ws://localhost:8080/chat" });
const subscriptions: StompSubscription[] = [];

const group = ref<Group>();
const messages = ref<Message[]>([]);
const scrollArea = ref<QScrollArea | null>(null);
const infiniteScroll = ref<QInfiniteScroll | null>(null);
const input = ref<HTMLInputElement | null>(null);
const inputText = ref<string>("");

function getUsername(message: Message) {
    const authorId = message.authorId;
    const author = group.value?.members.find((m) => m.id === authorId);

    return author ? author.username : "Deleted user";
}

function isSent(message: Message) {
    return message.authorId === userStore.data?.id;
}

async function onLoad(index: unknown, done: () => void) {
    if (!messages.value.length) {
        done();
        return;
    }

    const oldestMessageId = messages.value?.at(0).id;

    const olderMessages: Message[] = await GroupService.getGroupMessagesAfterSpecific(+route.params.id, 20, oldestMessageId);
    if (!olderMessages.length) {
        stop();
        return;
    }
    olderMessages.sort((a, b) => a.id - b.id);
    messages.value = olderMessages.concat(messages.value);

    done();
}

function onSubmit() {
    if (inputText.value.trim().length === 0) return;

    sendMessage(inputText.value);

    inputText.value = "";
    input.value?.focus();
}

function showAddFriendToGroupDialog() {
    const onAdd = () => {
        updateGroup();
    }

    $q.dialog({
        component: AddFriendToGroupDialog,
        componentProps: {
            groupId: group.value?.id,
            members: group.value?.members,
            callback: onAdd
        }
    })
}

async function leaveGroup() {
    router.push({ name: ROUTE_NAMES.HOME});
    await GroupService.leaveGroup(group.value?.id);
    userStore.updateGroups();
}

function showUserDialog(userId: number) {
    const userInDialog = group.value?.members.find((m) => m.id === userId);

    $q.dialog({
        component: UserDialog,
        componentProps: {
            user: userInDialog
        }
    });
}

function sendMessage(message: string) {
    stomp.publish({
        destination: `/ws/chat/group/${group.value?.id}`,
        body: JSON.stringify({
            authorId: userStore.data?.id,
            content: message
        })
    });
}

async function updateGroup() {
    group.value = await GroupService.getGroupAndMembers(+route.params.id);
}

async function setupConversation(id: number) {
    group.value = await GroupService.getGroupAndMembers(id);

    messages.value = await GroupService.getGroupMessages(id, 20);
    messages.value.sort((a, b) => a.id - b.id);

    const sub = stomp.subscribe(`/topic/messages/group/${id}`, (message) => {
        const received: Message = JSON.parse(message.body);

        messages.value.push(received);
        nextTick(() => {
            scrollArea.value?.setScrollPosition("vertical", 9999);
        });
    });
    subscriptions.push(sub);

    input.value?.focus();
    nextTick(() => {
        scrollArea.value?.setScrollPosition("vertical", 9999);
    });
}

watch(
    () => route.params,
    async (toParams) => {
        while (subscriptions.length > 0) {
            subscriptions.pop()?.unsubscribe();
        }

        await setupConversation(+toParams.id);
    }
);

onMounted(async () => {
    stomp.activate();

    setupConversation(+route.params.id);
    scrollArea.value?.setScrollPercentage("vertical", 1);
});

onUnmounted(() => {
    stomp.deactivate();
});
</script>
