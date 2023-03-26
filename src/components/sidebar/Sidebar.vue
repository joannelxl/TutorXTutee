<script>
import SidebarLink from "./SideBarLink.vue";
import { collapsed, toggleSidebar, sidebarWidth } from "./state";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      user: false,
    };
  },
  props: {},
  components: { SidebarLink, SidebarLink },
  setup() {
    return { collapsed, toggleSidebar, sidebarWidth };
  },
  methods: {
    redirectHomepage() {
      this.$router.push({ path: "/Home" });
    },
    signOut() {
      const auth = getAuth();
      const user = auth.currentUser;
      signOut(auth, user);
      console.log("Successfully Signed out");
      this.$router.push({ path: "/" });
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
      }
    });
  },
};
</script>

<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <br /><br />

    <img
      @click="redirectHomepage"
      alt="logo"
      src="src\assets\logo_transparent.png"
    />
    <div class="links">
      <br /><br /><br /><br />
      <SidebarLink to="/Home" icon="fas fa-home">Home</SidebarLink>
      <br />
      <SidebarLink to="/MyTutees" icon="fas fa-users">My Tutees</SidebarLink>
      <br />
      <SidebarLink to="/Requests" icon="fas fa-user-plus">Requests</SidebarLink>
      <br />
      <SidebarLink to="/Chats" icon="fas fa-comments">Chats</SidebarLink>
      <br />
      <SidebarLink to="/MyProfile" icon="fas fa-user">My Profile</SidebarLink>
    </div>

    <span
      class="collapse-icon"
      :class="{ 'rotate-180': collapsed }"
      @click="toggleSidebar"
    >
      <i class="fas fa-angle-double-left"></i>
    </span>

    <br /><br />
    <div v-if="!collapsed">
      <button @click="signOut()">Logout</button>
    </div>
  </div>
</template>

<style>
:root {
  --sidebar-bg-color: #dcb4dc;
  --sidebar-item-hover: #c09bc0;
  --sidebar-item-active: #c09bc0;
}
</style>

<style scoped>
.sidebar {
  color: black;
  background-color: var(--sidebar-bg-color);
  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.5em;

  transition: 0.3s ease;

  display: flex;
  flex-direction: column;
}

.sidebar h1 {
  height: 2.5em;
}

.collapse-icon {
  position: absolute;
  bottom: 0;
  padding: 0.75em;

  color: black;

  transition: 0.2s linear;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}

button {
  top: 50%;
  background-color: #c77cc7;
  color: black;
  border: none;
  border-radius: 10px;
  padding: 15px;
  min-height: 30px;
  min-width: 120px;
}

button:hover {
  background-color: rgba(128, 0, 128, 0.66);
  transition: 0.3s;
}
</style>
