<template>
  <!-- Button to add request -->
  <button id="show-modal" @click="showModal = true">+</button>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showModal" class="modal-mask">
        <div class="modal-container">
          <button class="close-button" @click="handleClose">x</button>
          <div class="modal-title">
            <h1>Fill in your request here!</h1>
          </div>
          <form id="requestform" @submit.prevent="">
            <div class="modal-body">
              <label class="required">Subject:</label>
              <input type="text" v-model="subject" />
              <br /><br />

              <label class="required">Level:</label>
              <input type="text" v-model="level" />
              <br /><br />

              <label class="required">Preferred Days:</label>
              <input type="text" v-model="preferredDays" />
              <br />
              <br />
              <label class="required">Preferred Time:</label>
              <input type="text" v-model="preferredTime" />
              <br /><br />

              <label class="required">Location:</label>
              <select v-model="location">
                <option value="North">North</option>
                <option value="East">East</option>
                <option value="South">South</option>
                <option value="West">West</option>
              </select>
              <br /><br />

              <label class="required">Address:</label>
              <textarea type="text" v-model="address"></textarea>
              <br /><br />

              <label>Remarks:</label>
              <textarea type="text" id="remarks" v-model="remarks"> </textarea>
              <br /><br />

              <div class="error" v-if="formError">{{ formError }}</div>
              <br /><br />

              <button class="cancel-button" @click="handleClose">Cancel</button>
              <button class="add-button" @click="handleSubmit">Add!</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
    <!-- <RequestForm :showModal="showModal" @close="showModal = false" /> -->
  </Teleport>
</template>

<script>
import firebaseApp from "../firebase.js";
import { collection, getFirestore } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      //Fake email
      userID: "testtutee@gmail.com",
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
          User: this.userID,
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
  width: 20%;
  margin: auto;
  padding: 50px 50px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.close-button {
  float: right;
}

.modal-title {
  margin-top: 0;
  color: #42b983;
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
  padding: 5px;
}

.add-button {
  text-align: center;
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
  left: 1000px;
  top: 600px;
  border-radius: 50%;
  padding: 100px;
  font-size: 50px;
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
