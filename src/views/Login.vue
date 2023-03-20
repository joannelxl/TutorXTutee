<template>
    <br><br><br>
    <div id="login">
        <img id="logo" src="@/assets/logo.png" alt="" />
        <h2>Login</h2>
        <form>
            <label>Email:</label>
            <input type="email" v-model="email" required=""><br><br>
            <label>Password:</label>
            <input type="password" v-model="password" required=""><br><br>
        </form>
        <button type="button" v-on:click="login">Login</button><br><br>
        <router-link to="/signup">Create your account here</router-link>
    </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRoute } from 'vue-router'
const db = getFirestore(firebaseApp);
const auth = getAuth();

export default {
    name: "Login",
    data() {
        return {
            email: "",
            password: "",
        };
    },
    methods: {
        clearForm() {
            this.password = "";
        },
        async login() {
            const verifiedUser = await getDoc(
                doc(db, "VerifiedUsers", this.email)
            );
            if (verifiedUser.exists()) {
                var collection = "Tutees";
                if (verifiedUser.data().role == "tutor") {
                    collection = "Tutors";
                }
                const account = await getDoc(doc(db, collection, this.email));
            }

            signInWithEmailAndPassword(auth, this.email, this.password)
                .then((userCredential) => {
                    console.log("Logged in successfully!");
                    this.clearForm();
                    this.$router.push("/AllChats")

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Invalid email/password. Please try again.");
                    this.clearForm();
                });
        },
    },
};
</script>

<style scoped>
#login {
    width: 500px;
    border: 2px solid lightgray;
    background: white;
    text-align: center;
    align-items: center;
    font-size: 1.2em;
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
}

#logo {
    width: 350px;
}

form {
    text-align: right;
    align-items: center;
    display: inline-block;
}

label {

    height: 40px;
    width: 150px;
    padding-right: 5px;
}

input {
    width: 350px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid gray;
    font-size: 0.9em;
    font-family: Arial, Helvetica, sans-serif;
    padding-left: 5px;
    padding-right: 5px;
}

button {
    height: 30px;
    width: 80px;
    border-radius: 4px;
    border: 1px solid gray;
    font-size: 0.9em;
    font-family: Arial, Helvetica, sans-serif;
}

button:active {
  background-color:gainsboro;
  box-shadow: 0 1px lightgray;
  transform: translateY(1px);
}

</style>