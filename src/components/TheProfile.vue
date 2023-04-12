<template>
    <acknowledge-dialogue ref="acknowledgeDialogue"></acknowledge-dialogue>
    <div class="container" v-if="dataLoaded">
        <form id="editProfile">
            <div class="form">
                <div class="requiredForm">
                    <label for="firstName"> <b>First Name:</b> </label>
                    <input type="text" id="firstName" required="true" v-model.lazy="firstName"><br><br>

                    <label for="lastName"> <b>Last Name:</b> </label>
                    <input type="text" id="lastName" required="true" v-model.lazy="lastName"><br><br>
                </div>

                <label for="dateOfBirth"> <b>Date of Birth:</b> </label>
                <text>{{ dateOfBirth }}</text>
                <!--input id="dateOfBirth" v-model.lazy="dateOfBirth" disabled--><br><br>

                <label for="email"> <b>Email:</b> </label>
                <text>{{ email }}</text>
                <!--input id="email" v-model.lazy="email" disabled-->
                <div class="buttons">
                    <button class="button-button" id="updateButton" type="button" v-on:click="updateProfile"> Update
                        Particulars </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getDoc, getFirestore } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AcknowledgeDialogue from "./AcknowledgeDialogue.vue";

export default {
    name: "Profile",

    components: {
        AcknowledgeDialogue
    },

    mounted() {
        const auth = getAuth();
        const db = getFirestore(firebaseApp);
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user
                const verifiedUser = await getDoc(doc(db, "VerifiedUsers", this.user.email)
                );
                var collectn = "Tutees";
                if (verifiedUser.data().role == "tutor") {
                    collectn = "Tutors";
                }
                const account = await getDoc(doc(db, collectn, user.email))
                this.userProfile = account.data();
                this.firstName = this.userProfile.firstName
                this.lastName = this.userProfile.lastName
                this.dateOfBirth = this.userProfile.dateOfBirth
                this.email = user.email
                this.dataLoaded = true
                this.role = collectn
            }
        })
    },
    data() {
        return {
            userProfile: null,
            firstName: null,
            lastName: null,
            dateOfBirth: null,
            email: null,
            dataLoaded: false,
            role: null,
            user: null,
        };
    },
    methods: {
        async updateProfile() {
            const db = getFirestore(firebaseApp);
            let userProfile = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                dateOfBirth: document.getElementById("dateOfBirth").value,
                email: document.getElementById("email").value
            }
            if (
                userProfile.firstName == "" ||
                userProfile.lastName == ""
            ) {
                const acknowledge = await (this.$refs.acknowledgeDialogue).show({
                    message: "Please fill in all required fields"
                })
            } else {
                try {
                    const docRef = await updateDoc(doc(db, this.role, userProfile.email), {
                        firstName: userProfile.firstName,
                        lastName: userProfile.lastName,
                        dateOfBirth: userProfile.dateOfBirth,
                        email: userProfile.email
                    });
                    console.log(docRef);
                    console.log("profile updated successfully");
                    // alert("Particulars successfully updated");
                    this.$emit("updated");
                    const acknowledge = await (this.$refs.acknowledgeDialogue).show({
                        message: "Particulars Successfully Updated"
                    })
                }
                catch (error) {
                    console.error("Error updating profile, please try again. ", error);
                }
            }
        }
    }
};

</script>

<style scoped>
.container {
    /* width: 700px; */
    /* padding-bottom: 5vh; */
    /* margin-top: 2.5vh; */
    /* margin-left: 30vw; */
    /* margin-right: 30vw; */
    padding: 20px;
    text-align: center;
    display: inline-block;
}

input, text {
    width: 200px;
    height: 19px;
    float: right;
    padding: 5px;
    background-color: white;
    margin: 10px 0;
    font-size: large;
    text-align: left;
}

input {
    border-radius: 4px;
    border: 1px solid lightgray;
}

input[type="text"]:hover {
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.24);
    border-radius: 2px;
}

label {
    height: 20px;
    text-align: left;
    float: left;
    padding: 5px;
    margin: 10px 0;
    font-size: large;
}

.form {
    margin: 20px;
    background-color: white;
    width: 380px;
    padding: 40px 40px;
    border-radius: 20px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.buttons {
    text-align: center;
    font-size: large;
}

.button-button {
    border-radius: 8px;
    text-align: left;
    margin-top: 20px;
    margin-bottom: 5px;
    border: 1px solid black;
    font-size: large;
    cursor: pointer;
    padding: 10px 15px;
}

.button-button:hover {
    background-color: #e0dad4;
}
</style>