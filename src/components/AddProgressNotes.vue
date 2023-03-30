<template>
    <ConfirmDialogue ref="confirmDialogue"></ConfirmDialogue>
    <router-link :to="{ name: 'Progress' }">Back to Progress</router-link>
    <div class="modal-mask">
        <div class="form-container">
            <h1>Tutor X Tutee</h1>
            <h4>Keep track of {{ tuteeName }}'s progress here.</h4>

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
                        <br /><br />

                        <label class="required">Remarks:</label>
                        <textarea rows="15" type="text" id="remarks" v-model="remarks"></textarea>

                        <div class="error" v-if="formError">{{ formError }}</div>
                        <br /><br />

                        <button class="add-button" @click="handleSubmit">Add Progress Note!</button>

                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { collection, getFirestore, doc, getDoc } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ConfirmDialogue from "./ConfirmDialogue.vue";

const db = getFirestore(firebaseApp);
export default {
    data() {
        return {
            //Fake email
            useremail: "",
            lesson: "",
            remarks: "",
            formError: "",
            tuteeName: "",
            id: this.id,
        };
    },
    components: {
        ConfirmDialogue,
    },
    emits: ["added"],
    methods: {
        async handleSubmit() {
            console.log(this.subject);
            //check if location is chosen
            if (
                this.lesson.length == 0 ||
                this.remarks.length == 0
            ) {
                this.formError = "Please fill in all required fields!";
            } else {
                let details = {
                    User: this.useremail,
                    Lesson: this.lesson,
                    Date: new Date(),
                    Remarks: this.remarks,
                    Id: this.id,
                };

                try {
                    const ok = await this.$refs.confirmDialogue.show({
                        title: "Add Progress Note",
                        message:
                            "Add Progress Note",
                        okButton: "Confirm Add",
                        cancelButton: "Go Back",
                    });
                    if (ok) {
                        const docRef = await addDoc(collection(db, "ProgressNotes"), details);
                    }
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
            (this.subject = ""),
                (this.lesson = ""),
                (this.remarks = ""),
                (this.formError = "");
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
.modal-mask {
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.form-container {
    width: 40%;
    height: 90%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    margin: auto;
}

.modal-container {
    width: 100%;
    margin: auto;
    padding: 20px 50px 50px 50px;
    background-color: #F3DDB0;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    border-radius: 25px;
}

.modal-title {
    text-align: center;
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
    border-radius: 25px;
    background-color: rgba(138, 121, 121, 0.26);
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
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
    float: right;
    background: rgba(3, 131, 0, 0.64);
    border-radius: 5px;
    width: 160px;
    text-align: left;
    margin-top: 2px;
    margin-bottom: 2px;
    margin-right: 9px;
    border: none;
    height: 30px;
    font-size: medium;
    cursor: pointer;
    box-shadow: 2px 2px gray;
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