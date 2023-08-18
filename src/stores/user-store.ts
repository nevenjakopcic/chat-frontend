import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AppUser } from "src/models/auth";

export const useUserStore = defineStore(
    "user",
    () => {
        const data = ref<AppUser | null>(null);

        const isAuthenticated = computed(() => data.value !== null);

        function login(payload: AppUser): void {
            data.value = payload;
        }

        function logout(): void {
            data.value = null;
        }

        return {
            data,
            isAuthenticated,
            login,
            logout
        };
    },
    {
        persist: {
            enabled: true
        }
    }
);
