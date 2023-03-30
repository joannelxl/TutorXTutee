<template>
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>

    <div class="main-container">
        <!-- Back to tutoring arrangement  -->
        <div style="float:left" v-if="role == 'tutor'">
            <br>
            <router-link to="/MyTutees" style="font-family: Arial, Helvetica, sans-serif">Back to MyTutees</router-link>
            <button id="show-modal" @click="navigateProgressNotes"></button>
        </div>

        <div style="float:left" v-if="role == 'tutee'">
            <br>
            <router-link to="/MyTutors" style="font-family: Arial, Helvetica, sans-serif">Back to MyTutors</router-link>
        </div>
        <h1>Tutor X Tutee</h1>
        <h4>All your written progress for {{ tuteeName }} are listed here.</h4>

        <!-- if tutee -->
        <div class="empty" v-if="progressNotes.length == 0 && role == 'tutee'">
            <h3>Your tutor has not added any progress note.</h3>
            <h3>Progress Notes will be displayed here once he/she writes one.</h3>
        </div>

        <!-- if tutee -->
        <div class="empty" v-if="progressNotes.length == 0 && role == 'tutor'">
            <h3>You do not have any progress notes now. </h3>
            <h3>To add please click the + button.</h3>
        </div>

        <div class="progress">
            <div class="req" v-for="note in progressNotes">
                <div class="card">
                    <div class="container">
                        <p class="date"> {{ note[1].Date.toDate().toLocaleDateString("en-GB") }}</p>
                        <p class="lesson"><strong>Lesson {{ note[1].Lesson }}</strong></p>

                    </div>
                    <br><br>
                    <p class="remarks">
                        {{ note[1].Remarks }}
                        <br><br>
                        <button v-if="role == 'tutor'" class="delete-button" @click="handleDelete(note[0])">
                            Delete Note
                        </button>
                    </p>

                </div>

                <br>
            </div>
        </div>
    </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { deleteDoc, getFirestore, getDoc } from "firebase/firestore";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    orderBy,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import ConfirmDialogue from "./ConfirmDialogue.vue";


const db = getFirestore(firebaseApp);
export default {
    props: {
        id: String
    },
    components: {
        ConfirmDialogue,
    },
    data() {
        return {
            progressNotes: [],
            useremail: "",
            role: '',
            tuteeName: '',
            id: this.id,
        };
    },
    methods: {
        navigateProgressNotes() {
            this.$router.push({ name: "AddProgress", params: { id: this.id } })
        },
        async display() {
            this.progressNotes = [];
            const progressRef = collection(db, "ProgressNotes");
            const q = query(progressRef, orderBy("Lesson", 'desc'), where("Id", "==", this.id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.progressNotes.push([doc.id, doc.data()]);
            });
        },
        async handleDelete(requestId) {
            const ok = await this.$refs.confirmDialogue.show({
                title: "Delete Progress Note",
                message:
                    "Are you sure you want to delete this Progress Note? This action cannot be undone.",
                okButton: "Confirm deletion",
                cancelButton: "Go Back",
            });
            if (ok) {
                await deleteDoc(doc(db, "ProgressNotes", requestId));
                this.display();
            }
        },
    },
    async mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                //to obtain role
                this.useremail = user.email;
                const verifiedUser = await getDoc(doc(db, "VerifiedUsers", this.useremail));
                this.role = verifiedUser.data().role

                //display 
                this.display();

                //to get tutee name
                const docRef = doc(db, "TutoringArrangements", this.id);
                try {
                    const docSnap = await getDoc(docRef);
                    var account = await getDoc(doc(db, "Tutees", docSnap.data().tuteeEmail))
                    this.tuteeName = account.data().firstName + " " + account.data().lastName
                } catch (error) {
                    console.log(error)
                }
                this.dataLoaded = true

            }
        })
    },
};
</script>

<style scoped>
.main-container {
    width: 70%;
    height: 90%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}

.empty {
    background-color: #f3ddb0;
    padding: 5px 10px;
    border-radius: 10px;
    margin: 0px;

}

.card {
    justify-content: center;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    text-align: left;
    min-height: 100%;
    background-color: #f3ddb0;
    height: 20%;
    padding-bottom: 2px;
}

.lesson {
    float: left
}

.date {
    float: right;
    margin-right: 15px;
    font-family: 'Radley';
    font-weight: bold
}

.remarks {

    overflow-wrap: break-word;
    text-overflow: ellipsis;
    margin-left: 16px;
    overflow: auto;
    justify-content: baseline;
    padding-right: 20px;
}

.container {
    padding-left: 15px;
}

.progress {
    grid-template-columns: auto auto auto;
    row-gap: 5px;
    column-gap: 30px;
}

.delete-button {
    border-radius: 5px;
    width: 90px;
    text-align: left;
    margin-top: 2px;
    margin-bottom: 2px;
    margin-right: 9px;
    border: none;
    height: 30px;
    font-size: small;
    cursor: pointer;
    box-shadow: 2px 2px gray;
    background-color: rgba(240, 51, 51, 0.56);
    float: left
}

.delete-button:hover {
    cursor: pointer;
    background-color: white;
}

#show-modal {
    position: fixed;
    right: 100px;
    bottom: 0;
    width: 6em;
    height: 6em;
    border-radius: 50%;
    background: linear-gradient(#fff, #fff), linear-gradient(#fff, #fff), #000;
    background-position: center;
    background-size: 50% 0.5em, 0.5em 50%;
    background-repeat: no-repeat;
    background-color: rgba(240, 51, 51, 0.56);
}

#show-modal:hover {
    background-color: rgba(177, 36, 36, 0.56);
    cursor: pointer;
}
</style>