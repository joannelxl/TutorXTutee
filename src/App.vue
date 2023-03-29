<script>
import Sidebar from '@/components/sidebar/Sidebar.vue'
import { sidebarWidth } from '@/components/sidebar/state'
import SignUp from '@/views/SignUp.vue'
import Login from '@/views/Login.vue'
import AllChats from '@/views/AllChats.vue'
import ConfirmDialogue from './components/ConfirmDialogue.vue'
import PopupModal from './components/PopupModal.vue'

export default {
    name: 'App',
    components: {
        SignUp,
        Login,
        Sidebar,
        Signup,
        Login,
        AllChats,
        ConfirmDialogue, 
        PopupModal
    },
    setup() {
        return { sidebarWidth }
    }
}
</script>

<template>
    <Sidebar v-if="!$route.meta.hideNavbar" />
    <div :style="{ 'margin-left': sidebarWidth }">
        <router-view />
    </div>
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 500px;
}
body {
    background: rgba(128, 0, 128, 0.1);
}

/* nav bar styling */
#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #620562;
}
</style>