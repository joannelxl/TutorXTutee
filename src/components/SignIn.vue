<template>
   <div>
      <h1>Sign In</h1>
      <form @submit.prevent="signIn">
         <label>
            Email:
            <input type="email" v-model="email" />
         </label>
         <label>
            Password:
            <input type="password" v-model="password" />
         </label>
         <button type="submit">Sign In</button>
      </form>
      <div v-if="errorMessage">{{ errorMessage }}</div>
   </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
   data() {
      return {
         email: "",
         password: "",
         errorMessage: null
      };
   },
   methods: {
      signIn() {
         firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then(() => {
               this.$router.push("/");
            })
            .catch(error => {
               this.errorMessage = error.message;
            });
      }
   }
};
</script>