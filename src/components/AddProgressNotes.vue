<template>
    <acknowledge-dialogue ref="acknowledgeDialogue"></acknowledge-dialogue>
    <div class="modal-mask" v-if="dataLoaded">

        <div style="float:left; margin-left:5vw;">
            <router-link :to="{ name: 'Progress' }">Back to Progress</router-link>
        </div>
        <div class="form-container">

            <div class="modal-container">
                <form id="requestform" @submit.prevent="">
                    <div class="modal-body">
                        <div class="tuteeName"
                            style="display:flex;flex-direction: row; justify-content: left; align-items: center">
                            <label>Tutee: </label>
                            <p>{{ tuteeName }}</p>
                        </div>

                        <label class=" required">Lesson Number:</label>
                        <input type="number" v-model="lesson" />
                        <br />

                        <label class="required">Remarks:</label>
                        <textarea style="font-size: 15px;" rows="15" type="text" id="remarks" v-model="remarks"></textarea>

                        <div class="error" v-if="formError">{{ formError }}</div>
                        <br />

                        <button class="add-button" @click="handleSubmit">Create progress note</button>

                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { collection, getFirestore, doc, getDoc, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AcknowledgeDialogue from "./AcknowledgeDialogue.vue";

const db = getFirestore(firebaseApp);
export default {
    data() {
        return {
            //Fake email
            useremail: "",
            lesson: '',
            remarks: "",
            formError: "",
            tuteeName: "",
            id: this.id,
            dataLoaded: false,
        };
    },
    components: {
        AcknowledgeDialogue,
    },
    emits: ["added"],
    methods: {
        async handleSubmit() {

            //check if location is chosen
            if (
                this.lesson.length == 0 ||
                this.remarks.length == 0) {

                this.formError = "Please fill in all required fields!"

            } else if (
                this.lesson < 1
            ) {
                this.formError = "Lesson number cannot be negative!";
            }

            else {
                let details = {
                    User: this.useremail,
                    Lesson: this.lesson,
                    Date: new Date(),
                    Remarks: this.remarks,
                    Id: this.id,
                };
                try {
                    await addDoc(collection(db, "ProgressNotes"), details);
                    await (this.$refs.acknowledgeDialogue).show({
                        message: "New Progress Note added!",
                    })
                } catch (error) {
                    console.error("Error adding document: ", error);
                }
                this.handleReset();
                this.$emit("added");
                this.handleClose();

                this.$router.push({ name: "Progress", params: { id: this.id } })

            }
        },
        async handleClose() {
            this.showModal = false;
            this.handleReset();
        },
        async handleReset() {
            this.subject = ""
            this.lesson = ""
            this.remarks = ""
            this.formError = ""
        },
    },
    async mounted() {

        this.id = this.$route.params.id;
        const auth = getAuth();
        const db = getFirestore(firebaseApp);

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.useremail = user.email;
                const docRef = doc(db, "TutoringArrangements", this.id);
                try {
                    const docSnap = await getDoc(docRef);
                    const account = await getDoc(doc(db, "Tutees", docSnap.data().tuteeEmail))
                    this.tuteeName = account.data().firstName + " " + account.data().lastName
                } catch (error) {
                }
                this.dataLoaded = true

            }
        })
    },
};
</script>

<style scoped>
.modal-mask {
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.form-container {
    border-radius: 10px;
    padding: 10px;
    margin: 20px;
    margin-top: 0px;
    width: 750px;
    margin-left: 200px;
}

.modal-container {
    width: 100%;
    margin: auto;
    padding: 20px 50px 50px 50px;
    background-color: #F1DEC9;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    padding-bottom: 60px;

}

.heading {
    display: inline-block;
    margin-left: 100px;
}

.modal-body {
    text-align: left;

}

form label {
    font-weight: bold
}

input[type=number],
input[type=date],
textarea {
    border-radius: 2px;
    background-color: rgba(138, 121, 121, 0.26);
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;

}

select {
    width: 58%;
}

form {
    text-align: center;
    align-items: center;
    margin: auto;
}

textarea {
    resize: none;
}

label {
    margin-right: 10px;
}

input {
    height: 15px;
}

.add-button {
    border-radius: 5px;
    text-align: left;
    margin-top: 5px;
    margin-bottom: 5px;
    border: none;
    font-size: large;
    cursor: pointer;
    box-shadow: 2px 2px gray;
    float: right;
    text-align: center;
    padding: 10px;
}

.add-button:hover {
    cursor: pointer;
    background-color: white;
}

.cancel-button {
    text-align: center;
    background: #d9d9d9;
    border: 1px solid #000000;
    font-size: 20px;
    margin-left: 50px;
}

.required:after {
    content: "*";
    color: red;
}

.error {
    color: red;
    text-align: center;
    padding-bottom: 10px;
}

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>