import { createRouter, createWebHistory } from "vue-router";
import SignUp from  '@/views/SignUp.vue'
import Login from '@/views/Login.vue'

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
