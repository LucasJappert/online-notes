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
    }
];

const BASE_URL = import.meta.env.BASE_URL;
console.log(import.meta.env);

const router = createRouter({
    history: createWebHistory(BASE_URL),
    routes,
});

export default router;
