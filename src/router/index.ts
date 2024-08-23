import { createRouter, createWebHistory } from 'vue-router';

const routes: Array<any> = [
  {
    name: "Home",
    path: "/",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/index.html",
    redirect: "/",
  },
];

const BASE_URL = import.meta.env.BASE_URL;
console.log(import.meta.env);

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
});

export default router;
