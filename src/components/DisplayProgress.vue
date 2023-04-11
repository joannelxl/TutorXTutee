<template>
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>

    <div class="main-container">

        <!-- Back to tutoring arrangement  -->
        <div style="float:left; margin-left: 5vw;" v-if="role == 'tutor'">
            <router-link to="/MyTutees">Back to
                MyTutees</router-link>
            <button id="show-modal" @click="navigateProgressNotes"></button>
        </div>

        <div style="float:left;margin-left: 5vw;" v-if="role == 'tutee'">
            <router-link to="/MyTutors">Back to MyTutors</router-link>
        </div> <br>
        <div class="entire-card">

            <!--div class="heading">
                <h1 style="margin-top:0px">Tutor X Tutee</h1>
                <h4>All your written progress for {{ tuteeName }} are listed here.</h4>
            </div-->

            <div v-if="dataLoaded">
                <!-- if tutee -->
                <div class="empty" v-if="progressNotes.length == 0 && role == 'tutee'">
                    <h3>Your tutor has not added any progress note.</h3>
                    <h3>Progress Notes will be displayed here once he/she writes one.</h3>
                </div>

                <!-- if tutor -->
                <div class="empty" v-if="progressNotes.length == 0 && role == 'tutor'">
                    <h3>You have not written any progress notes for {{ tuteeName }}. </h3>
                    <h3>To add please click the '+'' button.</h3>
                </div>

                <div class="progress">
                    <div class="req" v-for="note in progressNotes" :key="note[0]">
                        <div class="card">
                            <div class="container">
                                <text style="font-size: large" class="date"> {{
                                    note[1].Date.toDate().toLocaleDateString("en-GB")
                                }}</text>
                                <text style="font-size: x-large" class="lesson"><strong>Lesson {{ note[1].Lesson
                                }}</strong></text>

                            </div>
                            <br><br>
                            <p class="remarks">
                                {{ note[1].Remarks }}
                                <br>
                                <button v-if="role == 'tutor'" class="delete-button" @click="handleDelete(note[0])">
                                    Delete Note
                                </button>
                            </p>

                        </div>

                        <br>
                    </div>
                </div>
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
            dataLoaded: false,
        };
    },
    methods: {
        navigateProgressNotes() {
            this.$router.push({ name: "AddProgress", params: { id: this.id } })
        },
        async display() {
            this.progressNotes = [];
            const progressRef = collection(db, "ProgressNotes");
            const q = query(progressRef, orderBy("Date", 'desc'), where("Id", "==", this.id));
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
                    const account = await getDoc(doc(db, "Tutees", docSnap.data().tuteeEmail))
                    this.tuteeName = account.data().firstName + " " + account.data().lastName
                    this.dataLoaded = true
                } catch (error) {
                    console.log(error)
                    this.dataLoaded = true
                }

            }
        })
    },
};
</script>

<style scoped>
.empty {
    background-color: #f3ddb0;
    padding: 5px 10px;
    border-radius: 10px;
    margin-top: 2vh;

}

.heading {
    display: inline-block;
}

.card {
    justify-content: center;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    text-align: left;
    min-height: 100%;
    background-color: #f3ddb0;
    height: 20%;
    padding: 10px;
    border-radius: 10px;
}

.entire-card {
    display: inline-block;
    border-radius: 10px;
    padding: 10px;
    padding-top: 0px;
    margin: 20px;
    margin-top: 0px;
    width: 750px;
    margin-left: 0vw;
}

.lesson {
    float: left;
    font-size: 16px;
}

.date {
    float: right;
    margin-right: 20px;
    font-weight: bold;

}

.remarks {
    overflow-wrap: break-word;
    text-overflow: ellipsis;
    margin-left: 16px;
    overflow: auto;
    justify-content: baseline;
    padding-right: 20px;
    line-height: 25px;
    margin-bottom: 0px;
    margin-top: 0px;
}

.container {
    padding-left: 15px;
    margin-top: 10px;
}

.progress {
    grid-template-columns: auto auto auto;
    row-gap: 5px;
    column-gap: 30px;
}

.delete-button {
    border-radius: 5px;
    padding: 5px;
    width: 120px;
    text-align: left;
    margin-top: 5px;
    margin-bottom: 5px;
    border: none;
    height: 40px;
    font-size: large;
    cursor: pointer;
    box-shadow: 2px 2px gray;
    background-color: #efa182;
    float: right;
    text-align: center;
}

.delete-button:hover {
    cursor: pointer;
    background-color: #d08a6e;
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