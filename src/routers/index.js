import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },

  {
    path: "/MyTutees",
    name: "MyTutees",
    component: () => import("../views/MyTutees.vue"),
  },

  {
    path: "/Requests",
    name: "Requests",
    component: () => import("../views/Requests.vue"),
  },

  {
    path: "/Chat",
    name: "Chat",
    component: () => import("../views/Chat.vue"),
  },
  {
    path: "/MyProfile",
    name: "MyProfile",
    component: () => import("../views/MyProfile.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
