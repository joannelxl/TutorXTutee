<template>
    <div v-if="role == 'Tutor'">
        <button id="show-modal" @click="navigateProgressNotes"></button>
    </div>

    <div class="main-container">
        <h1>Tutor X Tutee</h1>
        <h4>All your written progress are listed here.</h4>

        <!-- if tutor -->
        <h1 class="empty" v-if="progressNotes.length == 0 && role == 'Tutor'">
            You do not have any progress notes now. To add please click the + button.
        </h1>

        <!-- if tutee -->
        <h1 class="empty" v-if="progressNotes.length == 0 && role == 'Tutee'">
            Your tutor have not added any progress note. Progress Notes will be displayed here once he/she writes one.
        </h1>

        <div class="progress">
            <div class="req" v-for="note in progressNotes">
                <div class="card">
                    <div class="container">
                        <p class="date"> {{ note[1].Date.toDate().toLocaleDateString() }}</p>
                        <p class="lesson"><strong>Lesson {{ note[1].Lesson }}</strong></p>

                    </div>
                    <br><br>
                    <button v-if="role == 'Tutor'" class="delete-button" @click="handleDelete(note[0])">
                        Delete Note
                    </button>
                    <p class="remarks">
                        {{ note[1].Remarks }}
                    </p>

                </div>
                <br>
            </div>
        </div>
    </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { deleteDoc, getFirestore } from "firebase/firestore";


import {
    collection,
    getDocs,
    query,
    where,
    doc,
    orderBy,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);
export default {
    data() {
        return {
            progressNotes: [],
            useremail: "",
            //to be filled up 
            role: 'Tutor',
        };
    },

    methods: {
        navigateProgressNotes() {
            this.$router.push({ path: '/ProgressNotes' })
        },
        async display() {
            this.progressNotes = [];
            const progressRef = collection(db, "ProgressNotes");
            const q = query(progressRef, orderBy("Lesson", 'desc'));
            const querySnapshot = await getDocs(q);
            console.log("displayed");
            querySnapshot.forEach((doc) => {
                this.progressNotes.push([doc.id, doc.data()]);
            });
        },
        async handleDelete(requestId) {
            await deleteDoc(doc(db, "ProgressNotes", requestId));
            alert("Confirm delete");
            this.display();
        },
    },
    async mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.useremail = user.email;
                this.display();
            }
        });
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
    padding-top: 200px;
}

.card {
    justify-content: center;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    text-align: left;
    min-height: 100%;
    background-color: #f3ddb0;
    height: 20%;
    padding-bottom: 10px;
}

.lesson {
    float: left
}

.date {
    float: right;
}

.remarks {

    overflow-wrap: break-word;
    text-overflow: ellipsis;
    margin-left: 20px;
    overflow: auto;
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
    background-color: #f7a588;
    padding: 10px 10px;
    border-radius: 4px;
    font-size: small;
    margin-left: -5px;
    margin-right: 5px;
    margin-top: 10px;
    float: right
}

.delete-button:hover {
    background-color: #c27f66;
    cursor: pointer;
}

#show-modal {
    position: fixed;
    right: 40px;
    bottom: 0;
    width: 10em;
    height: 10em;
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