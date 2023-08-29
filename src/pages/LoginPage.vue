<template>
    <q-page
        class="bg-light-green-7 window-height window-width row justify-center items-center"
    >
        <div class="column">
            <div class="row">
                <h5 class="text-h5 text-white q-my-md">Chat</h5>
            </div>
            <div class="row">
                <q-card
                    square
                    bordered
                    class="q-pa-md shadow-1"
                    style="width: 400px"
                >
                    <q-card-section>
                        <q-form class="q-gutter-md">
                            <q-input v-model="username" label="username" />
                            <q-input
                                v-model="password"
                                type="password"
                                label="password"
                            />
                        </q-form>
                    </q-card-section>
                    <q-card-actions class="q-px-md">
                        <q-btn
                            unelevated
                            color="light-green-8"
                            size="lg"
                            class="full-width"
                            label="Login"
                            @click="login"
                        />
                    </q-card-actions>
                    <q-card-section class="text-center q-pa-none">
                        <p class="q-pt-sm text-grey-6">
                            Not registered? Create an Account
                        </p>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import ROUTE_NAMES from "src/router/routeNames";
import AuthService from "../services/authService";
import RelationshipService from "../services/relationshipService";
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const username = ref<string>("");
const password = ref<string>("");

async function login() {
    try {
        const data = await AuthService.login(username.value, password.value);
        userStore.login(data);

        userStore.updateGroups();
        userStore.updateRelationships();

        router.push({ name: ROUTE_NAMES.HOME });
    } catch (e) {
        console.log("Failed to login");
    }
}
</script>
