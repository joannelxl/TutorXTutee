<script>
import Sidebar from '@/components/sidebar/Sidebar.vue'
import { sidebarWidth } from '@/components/sidebar/state'
import Home from './views/Home.vue';
export default {
    components: { Sidebar },
    setup() {
        return { sidebarWidth }
    }
}
</script>
<template>
    <Sidebar />
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