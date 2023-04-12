<script>
import SidebarLink from "@/components/sidebar/SideBarLink.vue";
import { collapsed, toggleSidebar, sidebarWidth } from "./state";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

export default {
  data() {
    return {
      user: false,
      email: false,
      role: "",
      dataLoaded: false,
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
  async mounted() {
    const auth = getAuth();
    const db = getFirestore(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        const verifiedUser = await getDoc(
          doc(db, "VerifiedUsers", this.user.email)
        );
        this.role = verifiedUser.data().role;
        this.dataLoaded = true;
      }
    });
  },
};
</script>

<template>
  <div class="sidebar" :style="{ width: sidebarWidth }" v-if="dataLoaded">
    <br /><br />

    <img @click="redirectHomepage" alt="logo" src="src\assets\logo_transparent.png" />
    <div class="links">
      <br /><br /><br /><br />
      <SidebarLink to="/Home" icon="fas fa-home"> Home</SidebarLink>
      <SidebarLink to="/MyTutees" icon="fas fa-users" v-if="role == 'tutor'"> My Tutees</SidebarLink>
      <SidebarLink to="/MyTutors" icon="fas fa-users" v-else> My Tutors</SidebarLink>
      <SidebarLink to="/Requests" icon="fas fa-user-plus" v-if="role == 'tutor'"> Requests</SidebarLink>
      <SidebarLink to="/MyRequests" icon="fas fa-user-plus" v-else> My Requests</SidebarLink>
      <SidebarLink to="/Chat" icon="fas fa-comments"> Chats</SidebarLink>
      <SidebarLink to="/MyProfile" icon="fas fa-user"> My Profile</SidebarLink>
    </div>

    <span class="collapse-icon" :class="{ 'rotate-180': collapsed }" @click="toggleSidebar">
      <i class="fas fa-angle-double-left"></i>
    </span>

    <br /><br /><br><br>
    <div v-if="!collapsed">
      <button @click="signOut()">Logout</button>
    </div>
  </div>
</template>

<style>
:root {
  --sidebar-bg-color: #d3c0b2;
  --sidebar-item-hover: #c5ac99;
  --sidebar-item-active: #c5ac99;
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
  /* padding: 0.5em; */

  transition: 0.3s ease;

  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 20px 0 #d3c0b2;
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
  background-color: #b79780;
  color: black;
  border: none;
  border-radius: 10px;
  padding: 15px;
  min-height: 30px;
  min-width: 120px;
  font-size: large;
  box-shadow: 1px 1px grey;
}

img:hover {
  background-color: var(--sidebar-item-active);
  cursor: pointer;
}

button:hover {
  background-color: #e0dad4;
  transition: 0.3s;
}

.collapse-icon:hover {
  background-color: var(--sidebar-item-active);
}
</style>
