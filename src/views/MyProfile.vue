<template>
    <div class="profile">
        <div class="heading">
            <h1>Tutor x Tutee</h1>
            <h4>You can edit your profile here.</h4>
        </div>
        <TheProfile />
    </div>
</template>

<script>
import TheProfile from "../components/TheProfile.vue";

export default {
    components: {
        TheProfile
    }
};
</script>

<style scoped>
.profile {
 	text-align: center;
 	width: 90vw;
 }

 .heading {
 	text-align: center;

 }
</style>