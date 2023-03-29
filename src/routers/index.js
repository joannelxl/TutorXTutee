import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SignUp from "@/views/SignUp.vue";
import Login from "@/views/Login.vue";
import ProgressNotes from "@/views/ProgressNotes.vue";
import MyTutees from "@/views/MyTutees.vue";
import MyTutors from "@/views/MyTutors.vue";

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
    path: "/ProgressNotes",
    name: "ProgressNotes",
    component: ProgressNotes,
  },
  {
    path: "/MyTutees",
    name: "MyTutees",
    component: MyTutees,
  },
  {
    path: "/MyTutors",
    name: "MyTutors",
    component: MyTutors,
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
