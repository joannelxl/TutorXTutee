<template>
    <div class="homepage">
        <div class="title">

            <p class="welcomeTo">Welcome to</p>
            <p class="TutorXTutee">Tutor X Tutee</p>
        </div>
        <br><br>
        <div class="aboutUs">
            <div class="image-col">
                <img alt="TxT logo" src="@/assets/homepagePic.jpg" />
            </div>
            <div class="text-col">
                <h3>About Us</h3>
                <p>Tutor x Tutee aims to help tutors better manage and schedule their tutoring sessions with tutees. With
                    this
                    platform, we hope to reduce the barriers to voluntary tutoring and allow tutors to better focus on the
                    tutoring
                    sessions. Tutees will also be able to put up requests anytime they need help.</p>
            </div>
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
.homepage {
    max-width: 1140px;
}

.welcomeTo {
    color: rgba(128, 0, 128, 0.66);
    font-size: 4.5em;
    font-weight: 400px;
    width: 500px;
    margin-top: 0px;
    margin-bottom: 1%;

}

.TutorXTutee {
    color: rgba(128, 0, 128, 0.66);
    font-size: 6em;
    font-weight: 400px;
    top: 10px;
    width: 700px;
    margin-top: 1%;
    margin-bottom: 0px;
    margin-left: 400px;
}

img {
    max-width: 30em;
}

.image-col {
    flex-basis: 40%;
    margin-left: 200px;
}

.aboutUs {
    display: flex;
    align-items: center;
    justify-content: center;
}

.text-col {
    width: 0px;
}

.text-col h3 {
    margin-left: 5em;
    font-weight: 400px;
    font-size: 30px;
    width: 200px;

}

.text-col p {
    font-weight: 400px;
    font-size: 20px;
    line-height: 200%;
    width: 500px;
    margin-left: 200%;
}
</style>
