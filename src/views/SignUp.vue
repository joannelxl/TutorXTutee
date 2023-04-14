<template>
  <acknowledge-dialogue ref="acknowledgeDialogue"></acknowledge-dialogue>
  <div>
    <br /><br />
    <div id="signuppage">
      <div style="text-align: left">
        <router-link
          id="router"
          to="/"
          style="font-family: Arial, Helvetica, sans-serif"
          >Back to login page</router-link
        ><br />
      </div>

      <div id="signup">
        <img id="logo" src="@/assets/logo.png" alt="" />
        <h2>Sign Up</h2>
        <form id="signupform" @submit="(e) => signup(e)">
          <label>First Name:</label>
          <input
            type="text"
            v-model="firstName"
            required=""
            placeholder="Enter your first name"
          /><br /><br />
          <label>Last Name:</label>
          <input
            type="text"
            v-model="lastName"
            required=""
            placeholder="Enter your last name"
          /><br /><br />
          <label>Date of Birth:</label>
          <input
            type="date"
            v-model="dateOfBirth"
            required=""
            placeholder="Select a date"
            max="Date.now()"
          /><br /><br />
          <label>Email:</label>
          <input
            type="email"
            v-model="email"
            required=""
            placeholder="Enter your email"
          /><br /><br />
          <div id="password-div">
            <label>Password:</label>
            <input
              v-if="showPassword"
              type="text"
              class="input"
              v-model="password"
              required=""
              placeholder="Enter your password"
            />
            <input
              v-else
              type="password"
              class="input"
              required=""
              v-model="password"
              placeholder="Enter your password"
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
          <button id="signupbutton" type="submit">Sign up</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import AcknowledgeDialogue from "@/components/AcknowledgeDialogue.vue";
const db = getFirestore(firebaseApp);
const auth = getAuth();

export default {
  name: "SignUp",
  components: { AcknowledgeDialogue },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dateOfBirth: null,
      showPassword: false,
    };
  },
  methods: {
    clearForm() {
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.password = "";
      this.dateOfBirth = null;
    },
    async signup(e) {
      e.preventDefault();
      if (new Date(this.dateOfBirth) > Date.now()) {
        await this.$refs.acknowledgeDialogue.show({
          message: "Please select a valid date.",
        });
      } else {
        const verifiedUser = await getDoc(doc(db, "VerifiedUsers", this.email));
        if (!verifiedUser.exists()) {
          this.clearForm();
          await this.$refs.acknowledgeDialogue.show({
            message:
              "Unverified credentials. Please contact the organisation directly to verify your email address if you have not done so.",
          });
        } else {
          var collection = "Tutees";
          if (verifiedUser.data().role == "tutor") {
            collection = "Tutors";
          }
          const account = await getDoc(doc(db, collection, this.email));
          if (account.exists()) {
            this.clearForm();
            await this.$refs.acknowledgeDialogue.show({
              message: "This email is already in use. Please log in directly.",
            });
            this.$router.push("/");
          } else {
            createUserWithEmailAndPassword(
              auth,
              this.email,
              this.password
            ).catch((error) => {
              console.log(error.message);
            });
            await setDoc(doc(db, collection, this.email), {
              firstName: this.firstName,
              lastName: this.lastName,
              dateOfBirth: this.dateOfBirth,
            });
            this.clearForm();
            await this.$refs.acknowledgeDialogue.show({
              message:
                "Your account has been created successfully. Please log in.",
            });
            this.$router.push("/");
          }
        }
      }
    },
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
form {
  text-align: right;
  align-items: center;
  display: inline-block;
  padding-bottom: 40px;
}

#signuppage {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

#signup {
  background: white;
  border: 2px solid lightgray;
  padding: 10px;
  margin-top: 10px;
  text-align: center;
  align-items: center;
  width: 400px;
  font-size: 1em;
  font-family: Arial, Helvetica, sans-serif;
}

label {
  height: 30px;
  width: 120px;
  padding-right: 5px;
}

input {
  height: 30px;
  width: 280px;
  border: 1px solid lightgray;
  border-radius: 4px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 1em;
  font-family: Arial, Helvetica, sans-serif;
}

#logo {
  width: 260px;
  padding: 10px;
}

button {
  height: 40px;
  border-radius: 4px;
  border: 1px solid gray;
  font-size: 1em;
  font-family: Arial, Helvetica, sans-serif;
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
}

button:hover{
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
  margin-left: 159px;
  background-color: transparent;
  border: 0px;
}

#see {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 34px;
  margin-left: 160px;
  background-color: transparent;
  border: 0px;
}
</style>
