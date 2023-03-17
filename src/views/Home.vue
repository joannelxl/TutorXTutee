<template>
    <div class="homepage">
        <div class="title">

            <p class="welcomeTo">Welcome to</p>
            <p class="TutorXTutee">Tutor X Tutee</p>
            <img alt="TxT logo" src="@/assets/homepagePic.jpg" />

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

<script>
import { collapsed, toggleSidebar } from '../components/sidebar/state';

export default {
    name: "Home",
    setup() {
        return { collapsed, toggleSidebar }
    }
}
</script>

<style scoped>
.title .welcomeTo {
    font-weight: 400px;
    width: 40%;
    font-size: 70px;
    line-height: 55px;
    margin-top: 3%;
    color: rgba(128, 0, 128, 0.66);
    border: 1px solid #FFFFFF;
    margin-bottom: 2%;

}

.TutorXTutee {
    width: 80%;
    height: 0px;
    margin-top: 3%;
    font-weight: 400;
    font-size: 100px;
    line-height: 78px;
    color: rgba(128, 0, 128, 0.66);
    border: 1px solid #FFFFFF;
}

.title img {
    width: 45%;
    float: left;
    margin-left: 5%;
    height: auto;
    max-height: 10%;
    border: 1px solid #000000;
    margin-top: 2%;
}

.aboutUs h3 {
    float: right;
    margin-right: 16%;
    width: 20%;
    height: 2%;
    font-weight: 400px;
    font-size: 30px;
    line-height: 5%;
    color: #000000;
}

.aboutUs p {
    float: right;
    margin-right: 10%;
    width: 32%;
    top: 1%;
    font-weight: 400px;
    font-size: 20px;
    line-height: 200%;
    color: #000000;

}
</style>
