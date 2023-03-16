<template>
    <div>
        <br><br>
        <router-link id="router" to="/" style="font-family: Arial, Helvetica, sans-serif">Back to login page</router-link>
        <div id="signuppage">
            <div id="signup">
                <img id="logo" src="@/assets/logo.png" alt="">
                <h2>Sign Up</h2>
                <form id="signupform">
                    <label>First Name:</label>
                    <input type="text" v-model="firstName" required="" placeholder="Enter your first name"><br /><br>
                    <label>Last Name:</label>
                    <input type="text" v-model="lastName" required="" placeholder="Enter your last name"><br><br>
                    <label>Date of Birth:</label>
                    <input type="date" v-model="dateOfBirth" required="" placeholder="Select a date"
                        max="Date.now()"><br><br>
                    <label>Email:</label>
                    <input type="email" v-model="email" required="" placeholder="Enter your email"><br><br>
                    <label>Password:</label>
                    <input type="password" v-model="password" required="" placeholder="Enter your password"><br><br>
                </form>
                <button id="signupbutton" type="button" v-on:click="signup">Sign up</button>
            </div>
        </div>
    </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const db = getFirestore(firebaseApp);
const auth = getAuth();

export default {
    name: "SignUp",
    components: {},
    data() {
        return {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            dateOfBirth: null,
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
        async signup() {
            if (
                this.firstName == "" ||
                this.lastName == "" ||
                this.email == "" ||
                this.password == "" ||
                this.dateOfBirth == null
            ) {
                alert("Please fill in all the fields.");
            } else if (new Date(this.dateOfBirth) > Date.now()) {
                alert("Please select a valid date.");
            } else {
                const verifiedUser = await getDoc(doc(db, "VerifiedUsers", this.email));
                if (!verifiedUser.exists()) {
                    this.clearForm();
                    alert(
                        "Unverified credentials. Please contact the organisation directly to verify your email address if you have not done so."
                    );
                } else {
                    var collection = "Tutees";
                    if (verifiedUser.data().role == "tutor") {
                        collection = "Tutors";
                    }
                    const account = await getDoc(
                        doc(db, collection, this.email)
                    );
                    if (account.exists()) {
                        this.clearForm();
                        alert(
                            "This email is already in use. Please log in directly."
                        );
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
                        alert(
                            "Your account has been created successfully. Please log in."
                        );
                        this.$router.push("/");
                    }
                }
            }
        },
    },
};
</script>

<style scoped>
form {
    text-align: right;
    align-items: center;
    display: inline-block;
}

div {
    text-align: center;
}

#signuppage {
    background: white;
    border: 2px solid lightgray;
    margin: 0;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

#signup {
    text-align: center;
    align-items: center;
    width: 500px;
    font-size: 1.2em;
    font-family: Arial, Helvetica, sans-serif;
}

label {
    height: 40px;
    width: 150px;
    padding-right: 5px;
}

input {
    height: 40px;
    width: 350px;
    border: 1px solid lightgray;
    border-radius: 4px;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 0.9em;
    font-family: Arial, Helvetica, sans-serif;
}

#logo {
    width: 350px;
}

button {
    height: 40px;
    border-radius: 4px;
    border: 1px solid gray;
    font-size: 0.9em;
    font-family: Arial, Helvetica, sans-serif;
}
</style>