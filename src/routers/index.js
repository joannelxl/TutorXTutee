import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SignUp from "@/views/SignUp.vue";
import Login from "@/views/Login.vue";

const routes = [
  {
    path: "/SignUp",
    name: "SignUp",
    component: SignUp,
    meta: {
      hideNavbar: true,
    },
  },
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: {
      hideNavbar: true,
    },
  },
  {
    path: "/Home",
    name: "Home",
    component: Home,
  },
  {
    path: "/MyTutees",
    name: "MyTutees",
    component: () => import("../views/MyTutees.vue"),
  },
  {
    path: "/MyTutors",
    name: "MyTutors",
    component: () => import("../views/MyTutors.vue"),
  },
  {
    path: "/Requests",
    name: "Requests",
    component: () => import("../views/Requests.vue"),
  },
  {
    path: "/MyRequests",
    name: "MyRequests",
    component: () => import("../views/MyRequests.vue"),
  },
  {
    path: "/Chat",
    name: "Chat",
    component: () => import("../views/Chat.vue"),
  },
  {
    path: "/InChat/:id",
    name: "InChat",
    component: () => import("../views/InChat.vue"),
    params: true
  },
  {
    path: "/MyProfile",
    name: "MyProfile",
    component: () => import("../views/MyProfile.vue"),
  },
  {
    path: "/Progress/:id",
    name: "Progress",
    component: () => import("../views/Progress.vue"),
    params: true
  },
  {
    path: "",
    redirectTo: '/'
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
