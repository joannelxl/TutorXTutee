import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SignUp from "@/views/SignUp.vue";
import Login from "@/views/Login.vue";
import InChat from '@/views/InChat.vue'
import Chat from '@/views/Chat.vue'

const routes = [
  {
    path: "/SignUp",
    name: "SignUp",
    component: SignUp,
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
  {
    path: "/InChat",
    name: "InChat",
    component: () => import("../views/InChat.vue")
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
