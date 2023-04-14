<template>
  <acknowledge-dialogue ref="acknowledgeDialogue"></acknowledge-dialogue>
  <br /><br /><br />
  <div class="container">
    <div class="left">
      <h1>Welcome back!</h1>
      <img id="logo" src="@/assets/logo.png" alt="" />
    </div>
    <div id="login">
      <h2>Login to Account</h2>
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
        <button id="login-button" type="submit">Login</button><br /><br />
      </form>
      <br /><br />
      <router-link to="/signup">Create your account here</router-link>
    </div>
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
h2 {
  padding-left: 3vh;
}
.container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: absolute;
  width: 80%;
  max-width: 100%;
  min-height: 80%;
  left: 50%;
  transform: translate(-50%);
  overflow: hidden;
}

#login {
  width: 50%;
  background: white;
  text-align: center;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1em;
  padding-top: 20vh;
  padding-bottom: 19vh;
  position: relative;
  float: right;
}

.left {
  width: 50%;
  padding-top: 24vh;
  padding-bottom: 25vh;
  position: relative;
  float: left;
  background-color: #f4f2f0;
}

#logo {
  width: 260px;
  padding: 10px;
}

form {
  text-align: left;
  align-items: center;
  display: inline-block;
  padding-bottom: 10px;
}

label,
input {
  display: block;
  font-size: 1em;
}

/* label {
  height: 30px;
  width: 120px;
  padding-right: 5px;
  font-size: 1em;
}
*/

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

#login-button {
  border-radius: 20px;
  width: 260px;
  font-size: 1em;
  background-color: #f4f2f0;
}

button {
  height: 40px;
  border-radius: 16px;
  border: 0.8px solid gray;
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
  height: 34px;
  background-color: transparent;
  border: 0px;
  transform: translateY(-25%);
  margin-left: 15vh;
}

#see {
  position: absolute;
  top: 0;
  right: 0;
  height: 34px;
  background-color: transparent;
  border: 0px;
  transform: translateY(53%);
  margin-left: 14vh;
}
</style>
