<template>
    <router-link to="/MyTutees" style="font-family: Arial, Helvetica, sans-serif">back</router-link>
    <div class="modal-mask">
        <div class="form-container">
            <h1>Tutor X Tutee</h1>
            <h4>Keep track of your tutee's progress here.</h4>

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
import { collection, getFirestore } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);
export default {
    data() {
        return {
            //Fake email
            useremail: "",
            lesson: "",
            remarks: "",
            formError: "",
            tuteeName: 'Test',
        };
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
                };
                try {
                    const docRef = await addDoc(collection(db, "ProgressNotes"), details);
                } catch (error) {
                    console.error("Error adding document: ", error);
                }
                this.handleReset();
                this.$emit("added");
                this.handleClose();
                this.$router.push({ path: '/MyTutees' })

            }
        },
        async handleClose() {
            console.log("close??");
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
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.useremail = user.email;
            }
        });
    },
};
</script>

<style scoped>
.modal-mask {
    /* position: fixed; */
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background-color: rgba(0, 0, 0, 0.5); */
    /* display: flex; */
    /* transition: opacity 0.3s ease; */
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

/* .close-button {
    float: right;
    margin-top: -30px;
    margin-right: -30px;
    font-size: 20px;
    cursor: pointer;
} */

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
    border: 1px solid #000000;
    font-size: 20px;
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