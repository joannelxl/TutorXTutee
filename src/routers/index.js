import { createRouter, createWebHistory } from "vue-router";
import SignUp from  '@/views/SignUp.vue'
import Login from '@/views/Login.vue'
import Chat from '@/views/Chat.vue'
import AllChats from '@/views/AllChats.vue'

const routes = [
  {
    path: '/SignUp',
    name: 'SignUp',
    component: SignUp
  },
  {
    path:'/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Chat',
    name: 'Chat',
    component: Chat
  }, 
  {
    path: '/AllChats',
    name: 'AllChats',
    component: AllChats
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;