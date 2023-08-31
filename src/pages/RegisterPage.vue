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
                        <q-form @submit="register" class="q-gutter-md">
                            <q-input
                                v-model="username"
                                label="Username"
                                lazy-rules
                                :rules="[ val => val.length >= 3 || 'Min. 3 characters']"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="person" />
                                </template>
                            </q-input>

                            <q-input
                                type="email"
                                v-model="email"
                                label="Email"
                                error-message="Not a valid email address"
                                :error="!isValidEmail"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="mail" />
                                </template>
                            </q-input>

                            <q-input
                                type="password"
                                v-model="password"
                                label="Password"
                                :rules="[ val => val.length >= 3 || 'Min. 3 characters']"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="lock" />
                                </template>
                            </q-input>

                            <q-input
                                type="password"
                                v-model="confirmPassword"
                                label="Confirm password"
                                error-message="Passwords do not match"
                                :error="!passwordsMatch"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="lock" />
                                </template>
                            </q-input>

                            <div>
                                <q-btn
                                    label="Register"
                                    type="submit"
                                    color="light-blue-7"
                                    size="lg"
                                    class="full-width q-mt-sm"
                                />
                            </div>
                        </q-form>
                    </q-card-section>

                    <q-card-section class="text-center">
                        <router-link to="/login" class="text-grey-6">
                            Already have an account? Login here
                        </router-link>
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
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const username = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");

const passwordsMatch = computed(() => password.value === confirmPassword.value);
const isValidEmail = computed(() => email.value.toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ));

async function register() {
    try {
        await AuthService.register(username.value, password.value, email.value);

        const data = await AuthService.login(username.value, password.value);
        userStore.login(data);

        userStore.updateGroups();
        userStore.updateRelationships();

        router.push({ name: ROUTE_NAMES.HOME });
    } catch (e) {
        console.log("Failed to register");
    }
}
</script>
