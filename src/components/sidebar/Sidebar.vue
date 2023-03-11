<script>
import SidebarLink from './SideBarLink.vue';
import { collapsed, toggleSidebar, sidebarWidth } from './state'

export default {
    props: {},
    components: { SidebarLink, SidebarLink },
    setup() {
        return { collapsed, toggleSidebar, sidebarWidth }
    }
}
</script>

<template>
    <div class="sidebar" :style="{ width: sidebarWidth }">
        <h1>
            <span v-if="collapsed">
            </span>
            <span v-else>TutorXTutee</span>
        </h1>

        <img alt="logo" src="src\assets\logo_transparent.png" />

        <br><br>
        <SidebarLink to="/" icon="fas fa-home">Home</SidebarLink>
        <br>
        <SidebarLink to="/MyTutees" icon="fas fa-users">My Tutees</SidebarLink>
        <br>
        <SidebarLink to="/Requests" icon="fas fa-user-plus">Requests</SidebarLink>
        <br>
        <SidebarLink to="/Chats" icon="fas fa-comments">Chats</SidebarLink>
        <br>
        <SidebarLink to="/MyProfile" icon="fas fa-user">My Profile</SidebarLink>

        <span class="collapse-icon" :class="{ 'rotate-180': collapsed }" @click="toggleSidebar">
            <i class="fas fa-angle-double-left"></i> </span>

        <br><br>
        <button>Logout</button>
    </div>
</template>


<style>
:root {
    --sidebar-bg-color: #800080;
    --sidebar-item-hover: #620562;
    --sidebar-item-active: #620562;
}
</style>

<style scoped>
.sidebar {
    color: white;
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

    color: rgba(255, 255, 255, 0.7);

    transition: 0.2s linear;
}

.rotate-180 {
    transform: rotate(180deg);
    transition: 0.2s linear;
}
</style>