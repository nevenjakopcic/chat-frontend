import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AppUser } from "src/models/auth";
import { Group, Relationship } from "src/models/chat";
import GroupService from "src/services/groupService";
import RelationshipService from "src/services/relationshipService";

export const useUserStore = defineStore(
    "user",
    () => {
        const data = ref<AppUser | null>(null);
        const groups = ref<Group[]>([]);
        const relationships = ref<Relationship[]>([]);

        const isAuthenticated = computed(() => data.value !== null);

        function login(payload: AppUser): void {
            data.value = payload;
        }

        function logout(): void {
            data.value = null;
        }

        function setGroups(payload: Group[]): void {
            groups.value = payload;
        }

        async function updateGroups(): Promise<void> {
            setGroups(await GroupService.getAllGroups());
        }

        function setRelationships(payload: Relationship[]): void {
            relationships.value = payload;
        }

        async function updateRelationships(): Promise<void> {
            setRelationships(await RelationshipService.getAllRelationships());
        }

        return {
            data,
            groups,
            relationships,
            isAuthenticated,
            login,
            logout,
            updateGroups,
            updateRelationships
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
