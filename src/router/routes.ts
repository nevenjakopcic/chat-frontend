import { RouteRecordRaw } from "vue-router";
import ROUTE_NAMES from "./routeNames";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: () => import("layouts/BasicLayout.vue"),
        redirect: () => {
            return { path: "/home" };
        },
        children: [
            {
                path: "/login",
                name: ROUTE_NAMES.LOGIN,
                component: () => import("pages/LoginPage.vue"),
                meta: {
                    guest: true
                }
            }
        ]
    },
    {
        path: "/chat",
        component: () => import("layouts/ChatLayout.vue"),
        children: [
            {
                path: "/home",
                name: ROUTE_NAMES.HOME,
                component: () => import("pages/HomePage.vue"),
                meta: {
                    auth: true
                }
            },
            {
                path: "/group/:id",
                name: ROUTE_NAMES.CONVERSATION,
                component: () => import("pages/ConversationPage.vue"),
                meta: {
                    auth: true
                }
            },
            {
                path: "/test",
                name: ROUTE_NAMES.TEST,
                component: () => import("pages/TestPage.vue"),
                meta: {
                    auth: true
                }
            }
        ]
    },
    {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue")
    }
];

export default routes;
