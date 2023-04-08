<template>
  <!-- Button to add request -->
  <acknowledge-dialogue ref="acknowledgeDialogue"></acknowledge-dialogue>
  <button id="show-modal" @click="showModal = true"></button>

  <div v-if="showModal" class="modal-mask">
    <div class="modal-container">
      <button class="close-button" @click="handleClose">x</button>
      <div class="modal-title">
        <h1><strong>Fill in your request here!</strong></h1>
      </div>
      <form id="requestform" @submit.prevent="">
        <div class="modal-body">
          <label class="required">Subject:</label>
          <input type="text" placeholder="e.g. English" v-model="subject" />
          <br /><br />

          <label class="required">Level:</label>
          <input type="text" placeholder="e.g. Secondary 1" v-model="level" />
          <br /><br />

          <label class="required">Preferred Day:</label>
          <input
            type="text"
            placeholder="e.g. Tuesday"
            v-model="preferredDays"
          />
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
          <br /><br />

          <label class="required">Address:</label>
          <textarea
            rows="3"
            cols="27"
            type="text"
            placeholder="e.g. Computing drive 117417"
            v-model="address"
          ></textarea>
          <br /><br />

          <label>Remarks:</label>
          <textarea
            rows="5"
            cols="27"
            type="text"
            id="remarks"
            placeholder="e.g. I am having troubles writing essays"
            v-model="remarks"
          >
          </textarea>
          <br /><br />

          <div class="error" v-if="formError">{{ formError }}</div>
          <br /><br />

          <button class="cancel-button" @click="handleClose">Cancel</button>
          <button class="add-button" @click="handleSubmit">Add Request!</button>
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
      console.log(this.subject);
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
      console.log("close??");
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
  padding: 50px 50px;
  background-color: #ebdfeb;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.close-button {
  float: right;
  margin-top: -30px;
  margin-right: -30px;
  font-size: 20px;
  cursor: pointer;
}

.modal-title {
  margin-top: 0;
  text-align: center;
}

.modal-body {
  text-align: right;
  display: inline-block;
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

label {
  float: left;
  margin-right: 30px;
}

input {
  float: right;
  height: 15px;
  width: 180px;
}
.add-button {
  text-align: center;
  background: #e7e5aa;
  border: 1px solid #000000;
  font-size: 20px;
  float: right;
}

.cancel-button {
  text-align: center;
  background: #d9d9d9;
  border: 1px solid #000000;
  font-size: 20px;
  float: left;
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

#show-modal {
  position: fixed;
  right: 100px;
  bottom: 50px;
  width: 6em;
  height: 6em;
  border-radius: 50%;
  background: linear-gradient(#fff, #fff), linear-gradient(#fff, #fff), #000;
  background-position: center;
  background-size: 50% 0.5em, 0.5em 50%;
  background-repeat: no-repeat;
  background-color: rgba(240, 51, 51, 0.56);
  border: none;
  border: solid 0.5px;
}

#show-modal:hover {
  background-color: rgba(177, 36, 36, 0.56);
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
