import { route } from "quasar/wrappers";
import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory
} from "vue-router";
import ROUTE_NAMES from "./routeNames";

import routes from "./routes";
import { useUserStore } from "src/stores/user-store";

export default route(function (/* { store, ssrContext } */) {
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : process.env.VUE_ROUTER_MODE === "history"
        ? createWebHistory
        : createWebHashHistory;

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,
        history: createHistory(process.env.VUE_ROUTER_BASE)
    });

    Router.beforeEach((to, from, next) => {
        const userStore = useUserStore();
        const isAuthenticated = userStore.isAuthenticated;

        if (to.matched.some((record) => record.meta.auth) && !isAuthenticated) {
            next({
                name: ROUTE_NAMES.LOGIN
            });
        } else if (
            to.matched.some((record) => record.meta.guest) &&
            isAuthenticated
        ) {
            next({
                name: ROUTE_NAMES.HOME
            });
        } else {
            next();
        }
    });

    return Router;
});
