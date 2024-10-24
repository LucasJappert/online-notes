import { createRouter, createWebHistory } from 'vue-router';

const routes: Array<any> = [
    {
        path: "/index.html",
        redirect: "/",
    },
    {
        name: "Notepad",
        path: "/",
        component: () => import("../views/MyNotepad.vue"),
    },
    {
        name: "ProgressWork",
        path: "/progress-work",
        component: () => import("../views/ProgressWork.vue"),
    },
    {
        name: "NeonBorder",
        path: "/neon-border",
        component: () => import("../views/NeonBorder.vue"),
    },
    {
        name: "BeRightBackText",
        path: "/brb-text",
        component: () => import("../views/twitch/BeRightBackText.vue"),
    },
    {
        name: "MyStreamInfo",
        path: "/my-stream-info",
        component: () => import("../views/twitch/MyStreamInfo.vue"),
    },
];

const BASE_URL = import.meta.env.BASE_URL;
console.log(import.meta.env);

const router = createRouter({
    history: createWebHistory(BASE_URL),
    routes,
});

export default router;
