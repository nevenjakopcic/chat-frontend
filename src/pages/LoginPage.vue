<template>
    <q-page
        class="bg-light-blue-7 window-height window-width row justify-center items-center"
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
                        <q-form @submit="login" class="q-gutter-md">
                            <q-input
                                v-model="username"
                                label="Username"
                            />

                            <q-input
                                type="password"
                                v-model="password"
                                label="Password"
                            />

                            <div>
                                <q-btn
                                    label="Login"
                                    type="submit"
                                    color="light-blue-7"
                                    size="lg"
                                    class="full-width q-mt-sm"
                                />
                            </div>
                        </q-form>
                    </q-card-section>

                    <q-card-section class="text-center">
                        <a class="text-grey-6">
                            Not registered yet? Create an account
                        </a>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import ROUTE_NAMES from "src/router/routeNames";
import AuthService from "../services/authService";
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
