<script>
import SidebarLink from '@/components/sidebar/SideBarLink.vue';
import { collapsed, toggleSidebar, sidebarWidth } from './state'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

export default {
    data() {
        return {
            user: false,
            email: false,
            role: '',
            dataLoaded: false,
        }
    },
    props: {},
    components: { SidebarLink, SidebarLink },
    setup() {
        return { collapsed, toggleSidebar, sidebarWidth }
    },
    methods: {
        redirectHomepage() {
            this.$router.push({ path: '/Home' })
        }
    },
    async mounted() {
        const auth = getAuth();
        const db = getFirestore(firebaseApp);
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user
                const verifiedUser = await getDoc(doc(db, "VerifiedUsers", this.user.email));
                this.role = verifiedUser.data().role
                this.dataLoaded = true
            }
        })
        
    }
}
</script>

<template>
    <div class="sidebar" :style="{ width: sidebarWidth }" v-if="dataLoaded">

        <br><br>

        <img @click="redirectHomepage" alt="logo" src="src\assets\logo_transparent.png" />
        <div class="links">
            <br><br><br><br>
            <SidebarLink to="/Home" icon="fas fa-home">Home</SidebarLink>
            <br>
            <SidebarLink to="/MyTutees" icon="fas fa-users" v-if="role == 'tutor'">My Tutees</SidebarLink>
            <SidebarLink to="/MyTutors" icon="fas fa-users" v-else>My Tutors</SidebarLink>
            <br>
            <SidebarLink to="/Requests" icon="fas fa-user-plus" v-if="role == 'tutor'">Requests</SidebarLink>
            <SidebarLink to="/MyRequests" icon="fas fa-user-plus" v-else>My Requests</SidebarLink>
            <br>
            <SidebarLink to="/Chat" icon="fas fa-comments">Chats</SidebarLink>
            <br>
            <SidebarLink to="/MyProfile" icon="fas fa-user">My Profile</SidebarLink>
        </div>

        <span class="collapse-icon" :class="{ 'rotate-180': collapsed }" @click="toggleSidebar">
            <i class="fas fa-angle-double-left"></i> </span>


        <br><br>
        <div v-if="!collapsed">
            <button>Logout</button>
        </div>
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

img:hover {
    background-color: #c09bc0;
    cursor: pointer;
}

button:hover {
  background-color: rgba(128, 0, 128, 0.66);
  transition: 0.3s;
}
</style>
