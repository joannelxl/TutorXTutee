<template>
  <!-- Button to add request -->
  <acknowledge-dialogue ref="acknowledgeDialogue"></acknowledge-dialogue>
  <button id="show-modal" @click="showModal = true"></button>

  <div v-if="showModal" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <div class="close" @click="handleClose" style="font-size: large;">
          <b>&times;</b>
        </div>
        <div style="font-size:x-large"><b>Create your request</b></div>
      </div><br>
      <form id="requestform" @submit.prevent="">
        <div class="modal-body">
          <label class="required">Subject:</label>
          <input type="text" placeholder="e.g. English" v-model="subject" />
          <br /><br />

          <label class="required">Level:</label>
          <input type="text" placeholder="e.g. Secondary 1" v-model="level" />
          <br /><br />

          <label class="required">Preferred Day:</label>
          <input type="text" placeholder="e.g. Tuesday" v-model="preferredDays" />
          <br />
          <br />
          <label class="required">Preferred Time:</label>
          <input type="text" placeholder="e.g. 4pm" v-model="preferredTime" />
          <br /><br />

          <label class="required">Location:</label>
          <select v-model="location">
            <option value="North">North</option>
            <option value="East">East</option>
            <option value="South">South</option>
            <option value="West">West</option>
            <option value="Central">Central</option>
            <option value="Virtual">Virtual</option>
          </select>
          <br />

          <label class="required">Address:</label>
          <textarea rows="3" cols="27" type="text" placeholder="e.g. Computing drive 117417" v-model="address"></textarea>
          <br />

          <label>Remarks:</label>
          <textarea rows="5" cols="27" type="text" id="remarks" placeholder="e.g. I am having troubles writing essays"
            v-model="remarks">
            </textarea>
          <br />

          <div class="error" v-if="formError">{{ formError }}</div>
          <br />

          <button class="cancel-button" @click="handleClose">Cancel</button>
          <button class="add-button" @click="handleSubmit">Create request</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AcknowledgeDialogue from "./AcknowledgeDialogue.vue";
import firebaseApp from "../firebase.js";
import { collection, getFirestore } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);

export default {
  components: { AcknowledgeDialogue },
  data() {
    return {
      //Fake email
      useremail: "",
      subject: "",
      level: "",
      preferredDays: "",
      preferredTime: "",
      location: "",
      address: "",
      remarks: "",
      formError: "",
      showModal: false,
    };
  },

  emits: ["added"],

  methods: {
    async handleSubmit() {
      //check if location is chosen
      if (
        this.subject.length == 0 ||
        this.level.length == 0 ||
        this.preferredDays.length == 0 ||
        this.preferredTime.length == 0 ||
        this.address.length == 0 ||
        this.location.length == 0
      ) {
        this.formError = "Please fill in all required fields!";
      } else {
        let details = {
          User: this.useremail,
          Subject: this.subject,
          Level: this.level,
          PreferredDays: this.preferredDays,
          PreferredTime: this.preferredTime,
          Address: this.address,
          Location: this.location,
          Remarks: this.remarks,
        };

        try {
          const docRef = await addDoc(collection(db, "Requests"), details);
        } catch (error) {
          console.error("Error adding document: ", error);
        }
        this.handleReset();
        this.$emit("added");
        this.handleClose();
        await this.$refs.acknowledgeDialogue.show({
          message: "Request successfully created!",
        });
      }
    },

    async handleClose() {
      this.showModal = false;
      this.handleReset();
    },

    async handleReset() {
      (this.subject = ""),
        (this.level = ""),
        (this.preferredDays = ""),
        (this.preferredTime = ""),
        (this.location = ""),
        (this.address = ""),
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
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 30%;
  margin: auto;
  padding: 30px 20px;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.close {
    float: right;
    height: fit-content;
    cursor: pointer;
}

.modal-body {
  text-align: right;
  display: inline-block;
}

input:hover,
select:hover,
textarea:hover {
  box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.24);
}

select {
  height: 30px;
  width: 212px;
  border-radius: 5px;
  border: 1px solid lightgray;
  padding: 5px;
  margin: 5px 0px;
  font-size: medium;
}

form {
  text-align: center;
  align-items: center;
  margin: auto;
}

textarea {
  resize: none;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 200px;
  border-radius: 5px;
  border: 1px solid lightgray;
  padding: 5px;
  margin: 5px 0px;
  font-size: medium;
}

label {
  padding: 5px;
  float: left;
  margin-right: 30px;
  height: 15px;
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: medium;
}

input {
  float: right;
  width: 200px;
  border-radius: 5px;
  border: 1px solid lightgray;
  padding: 5px;
  height: 15px;
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: medium;
}

.add-button,
.cancel-button {
  text-align: center;
  border: 1px solid #000000;
  font-size: medium;
  border-radius: 5px;
  padding: 10px;
  margin: 0 30px;
  background-color: #F1DEC9;
}

.add-button {
  float: right;
}

.cancel-button {
  float: left;
}

.add-button:hover,
.cancel-button:hover {
  background-color: #C8B6A6;
}

.required:after {
  content: "*";
  color: red;
}

.error {
  color: red;
  text-align: center;
  padding-bottom: 10px;
  font-size: medium;
}

#show-modal {
  position: fixed;
  right: 100px;
  bottom: 50px;
  width: 5em;
  height: 5em;
  color: black;
  border-radius: 50%;
  background: linear-gradient(white, white), linear-gradient(white, white);
  background-position: center;
  background-size: 50% 0.35em, 0.35em 50%;
  background-repeat: no-repeat;
  background-color: #b79780;
  border: none;
  box-shadow: 1px 1px gray;
}

#show-modal:hover {
  background-color: #9f775a;
  cursor: pointer;
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
