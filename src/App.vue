<script>
import Sidebar from '@/components/sidebar/Sidebar.vue'
import { sidebarWidth } from '@/components/sidebar/state'
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

    <div class="homepage">
        <div class="title">
            <img alt="TxT logo" src="@/assets/homepagePic.jpg" />
            <p class="welcomeTo">Welcome to</p>
            <p class="TutorXTutee">Tutor X Tutee</p>
        </div>

        <div class="aboutUs">
            <h3>About Us</h3>
            <p>Tutor x Tutee aims to help tutors better manage and schedule their tutoring sessions with tutees. With this
                platform, we hope to reduce the barriers to voluntary tutoring and allow tutors to better focus on the
                tutoring
                sessions. Tutees will also be able to put up requests anytime they need help.</p>
        </div>
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
/* for homepage styling */
<style scoped>
.homepage {
    background-color: #ca95ca;
}

.title .welcomeTo {
    position: absolute;
    top: 30px;
    left: 300px;
    font-weight: 400;
    font-size: 70px;
    line-height: 55px;
    margin-top: 0px;
    /* identical to box height */

    color: rgba(128, 0, 128, 0.66);

    border: 1px solid #FFFFFF;
}

.TutorXTutee {
    top: 35px;
    position: absolute;
    width: 607px;
    height: 0px;
    left: 700px;
    font-weight: 400;
    font-size: 100px;
    line-height: 78px;
    /* identical to box height */


    color: rgba(128, 0, 128, 0.66);

    border: 1px solid #FFFFFF;
}

.title img {
    position: absolute;
    width: 46%;
    height: auto;
    max-height: 600px;
    left: 150px;
    top: 250px;
    border: 1px solid #000000;
    backdrop-filter: blur(2px);
}

.aboutUs h3 {
    position: absolute;
    width: 140px;
    height: 66px;
    left: 1050px;
    top: 250px;
    font-weight: bold;
    font-weight: 400;
    font-size: 30px;
    line-height: 23px;

    color: #000000;
}

.aboutUs p {
    position: absolute;
    width: 405px;
    height: 438px;
    left: 900px;
    top: 300px;
    font-weight: 400;
    font-size: 20px;
    line-height: 50px;

    color: #000000;

}
</style>