<template>
    <acknowledge-dialogue ref="acknowledgeDialogue"></acknowledge-dialogue>
    <div class="container" v-if="dataLoaded">
        <form id="editProfile">
            <!--div style="font-size: x-large;"> <b>My Profile</b> </div-->
            <h2>My Profile</h2> 
            <h4>You can edit your profile here</h4>
            <div class="form">
                <div class = "requiredForm">
                    <label for="firstName"> <b>First Name:</b> </label>
                    <input type="text" id="firstName" required="true" v-model.lazy="firstName"><br><br>

                    <label for="lastName"> <b>Last Name:</b> </label>
                    <input type="text" id="lastName" required="true" v-model.lazy="lastName"><br><br>
                </div>

                <label for="dateOfBirth"> <b>Date of Birth:</b> </label>
                <input id="dateOfBirth" v-model.lazy="dateOfBirth" disabled><br><br>

                <label for="email"> <b>Email:</b> </label>
                <input id="email" v-model.lazy="email" disabled><br><br>
            </div>
        </form>
        <div class="buttons">
            <button class = "button-button" id="updateButton" type="button" v-on:click="updateProfile"> Update Particulars </button>
        </div>
        <!-- Testing
        <h3>First Name: {{ userProfile.firstName }}</h3>
        <h3>Last Name: {{ userProfile.lastName }}</h3>
        -->
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
            catch(error) {
                console.error("Error updating profile, please try again. ", error);
            }
        }
    }
  }
};

</script>

<style scoped>
.container{
    padding-bottom: 5vh;
    margin-top: 2.5vh;
    margin-left: 30vw;
    margin-right: 30vw;
    text-align: center;
}

input{
    border-radius: 4px;
    background-color: white;
    padding: 5px;
}

input[type="text"]:hover {
    box-shadow: 3px 3px 7px rgba(0,0,0,0.24);
    border-radius: 2px;
}

label {
    width: 10em;
    display: inline-block;
    text-align: left;
    padding: 10px;
    font-size: large;
}
.form{
    margin-top: 1vh;
    padding-top: 2vh;
    padding-bottom: 1vh;
    background-color: #f3ddb0;
    border-color: #f3ddb0;
    border-radius: 10px;
}
.buttons{
    text-align: center;
    display: block;
    font-size: large;
}

.button-button{
    background-color: #dcb4dc;
    margin-top: 2vh;
}

.button-button:hover{
    background-color: #d293d2;
}

button {
	border-radius: 5px;
	padding: 5px;
	width: auto;
	text-align: left;
	margin-top: 5px;
	margin-bottom: 5px;
	border: none;
	height: 40px;
	font-size: large;
	cursor: pointer;
	box-shadow: 2px 2px gray;
}
</style>