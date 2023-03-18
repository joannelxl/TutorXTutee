<script setup>
import SignUp from "@/views/SignUp.vue";
import Login from "@/views/Login.vue";
import MyRequest from "./views/MyRequest.vue";
</script>

<template>
  <router-view />
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
  width: 500px;
}

body {
  background: rgba(128, 0, 128, 0.1);
}
</style>
