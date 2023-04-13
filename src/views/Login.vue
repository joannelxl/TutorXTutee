<template>
  <acknowledge-dialogue ref="acknowledgeDialogue"></acknowledge-dialogue>
  <br /><br /><br />
  <div id="login">
    <img id="logo" src="@/assets/logo_transparent.png" alt="" />
    <h2>Login</h2>
    <form id="loginform" @submit="(e) => login(e)">
      <label>Email:</label>
      <input type="email" v-model="email" required="" /><br /><br />
      <div id="password-div">
        <label>Password:</label>
        <input
          v-if="showPassword"
          type="text"
          class="input"
          v-model="password"
          required=""
        />
        <input
          v-else
          type="password"
          class="input"
          v-model="password"
          required=""
        />
        <button
          v-if="showPassword"
          type="button"
          id="unsee"
          @click="toggleShow"
        >
          <i class="fa regular fa-eye-slash"></i>
        </button>
        <button v-else type="button" id="see" @click="toggleShow">
          <i class="fa regular fa-eye"></i>
        </button>
      </div>
      <br /><br />
      <button type="submit">Login</button><br /><br />
    </form>
    <router-link to="/signup">Create your account here</router-link>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AcknowledgeDialogue from "@/components/AcknowledgeDialogue.vue";
const auth = getAuth();

export default {
  components: { AcknowledgeDialogue },
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    clearForm() {
      this.password = "";
    },
    async login(e) {
      e.preventDefault();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          console.log("Logged in successfully!");
          this.clearForm();
          //redirect to home
          this.$router.push({ path: "/Home" });
        })
        .catch(async (error) => {
          await this.$refs.acknowledgeDialogue.show({
            message: "Invalid email/password. Please try again.",
          });
          this.clearForm();
        });
    },
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
#login {
  width: 400px;
  border: 2px solid lightgray;
  background: white;
  text-align: center;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1em;
  margin-top: 10px;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}

#logo {
  width: 280px;
}

form {
  text-align: right;
  align-items: center;
  display: inline-block;
  padding-bottom: 10px;
}

label {
  height: 30px;
  width: 120px;
  padding-right: 5px;
  font-size: 1em;
}

input {
  width: 280px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid gray;
  font-size: 1em;
  font-family: Arial, Helvetica, sans-serif;
  padding-left: 5px;
  padding-right: 5px;
}

button {
  height: 40px;
  border-radius: 4px;
  border: 1px solid gray;
  font-size: 1em;
  font-family: Arial, Helvetica, sans-serif;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

button:hover {
  background-color: #e0dad4;
}

#password-div {
  position: relative;
}

#unsee {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 34px;
  margin-left: 150px;
  background-color: transparent;
  border: 0px;
}

#see {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 34px;
  margin-left: 151px;
  background-color: transparent;
  border: 0px;
}
</style>
