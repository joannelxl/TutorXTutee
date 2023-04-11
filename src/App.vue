<script>
import Sidebar from '@/components/sidebar/Sidebar.vue'
import { sidebarWidth } from '@/components/sidebar/state'
import SignUp from '@/views/SignUp.vue'
import Login from '@/views/Login.vue'
import InChat from '@/views/InChat.vue'
import ConfirmDialogue from './components/ConfirmDialogue.vue'
import PopupModal from './components/PopupModal.vue'
import Chat from './views/Chat.vue'
import prevMessages from './components/prevMessages.vue'

export default {
    name: 'App',
    components: {
        SignUp,
        Login,
        Sidebar,
        InChat,
        ConfirmDialogue, 
        PopupModal,
        Chat,
        prevMessages
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

<!-- <script>

  export default {
  name: "App",
  components: {
    SignUp,
    Login,
  },
};
</script>

 -->

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: white;
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

button {
  cursor: pointer;
}
</style>
