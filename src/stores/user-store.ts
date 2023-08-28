import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AppUser } from "src/models/auth";
import { Relationship } from "src/models/chat";
import RelationshipService from "src/services/relationshipService";

export const useUserStore = defineStore(
    "user",
    () => {
        const data = ref<AppUser | null>(null);
        const relationships = ref<Relationship[]>([]);

        const isAuthenticated = computed(() => data.value !== null);

        function login(payload: AppUser): void {
            data.value = payload;
        }

        function logout(): void {
            data.value = null;
        }

        function setRelationships(payload: Relationship[]): void {
            relationships.value = payload;
        }

        async function updateRelationships(): Promise<void> {
            setRelationships(await RelationshipService.getAllRelationships());
        }

        const getRelationships = computed(() => relationships);

        return {
            data,
            relationships,
            isAuthenticated,
            login,
            logout,
            updateRelationships,
            getRelationships
        };
    },
    {
        persist: {
            enabled: true,
            strategies: [
                {
                    storage: localStorage
                }
            ]
        }
    }
);
