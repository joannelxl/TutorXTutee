<template>
  <button id="show-modal" @click="getData">Edit Request</button>

  <div v-if="showModal" class="modal-mask">
    <div class="modal-container">
      <button class="close-button" @click="handleClose">x</button>
      <div class="modal-title">
        <h1>Edit your request</h1>
      </div>
      <form id="requestform" @submit.prevent="">
        <div class="modal-body">
          <label class="required">Subject:</label>
          <input type="text" :placeholder="subject" v-model="newSubject" />
          <br />

          <label class="required">Level:</label>
          <input type="text" :placeholder="level" v-model="newLevel" />
          <br />

          <label class="required">Preferred Days:</label>
          <input
            type="text"
            :placeholder="preferredDays"
            v-model="newPreferredDays"
          />
          <br />

          <label class="required">Preferred Time:</label>
          <input
            type="text"
            :placeholder="preferredTime"
            v-model="newPreferredTime"
          />
          <br />

          <label class="required">Location:</label>
          <select v-model="location">
            <option value="North">North</option>
            <option value="East">East</option>
            <option value="South">South</option>
            <option value="West">West</option>
          </select>
          <br />

          <label class="required">Address:</label>
          <textarea
            type="text"
            :placeholder="address"
            v-model="newAddress"
          ></textarea>
          <br />

          <label>Remarks:</label>
          <textarea
            type="text"
            id="remarks"
            :placeholder="remarks"
            v-model="newRemarks"
          >
          </textarea>
          <br />

          <button class="cancel-button" @click="handleClose">Cancel</button>
          <button class="edit-button" @click="handleEdit">Edit!</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { deleteDoc, getFirestore, updateDoc } from "firebase/firestore";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import EditRequest from "./EditRequest.vue";
const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      subject: "",
      level: "",
      preferredDays: "",
      preferredTime: "",
      location: "",
      address: "",
      remarks: "",
      showModal: false,
      requestID: this.requestId,
      newSubject: null,
      newLevel: null,
      newPreferredDays: null,
      newPreferredTime: null,
      newAddress: null,
      newRemarks: null,
    };
  },
  props: {
    requestId: String,
  },
  methods: {
    async getData() {
      this.showModal = true;
      console.log(this.requestId);
      const docRef = doc(db, "Requests", this.requestId);
      const docSnap = await getDoc(docRef);

      this.subject = docSnap.data().Subject;
      this.level = docSnap.data().Level;
      this.preferredDays = docSnap.data().PreferredDays;
      this.preferredTime = docSnap.data().PreferredTime;
      this.location = docSnap.data().Location;
      this.address = docSnap.data().Address;
      this.remarks = docSnap.data().Remarks;
    },

    async handleEdit() {
      //update the doc if there is any field filled in
      const docRef = doc(db, "Requests", this.requestId);
      console.log(this.requestId);
      console.log((await getDoc(docRef)).data());
      if (this.newSubject !== null) {
        await updateDoc(docRef, {
          Subject: this.newSubject,
        });
      }

      if (this.newLevel !== null) {
        await updateDoc(docRef, {
          Level: this.newLevel,
        });
      }

      if (this.newPreferredDays !== null) {
        await updateDoc(docRef, {
          PreferredDays: this.newPreferredDays,
        });
      }

      if (this.newPreferredTime !== null) {
        await updateDoc(docRef, {
          PreferredTime: this.newPreferredTime,
        });
      }

      if (this.newAddress !== null) {
        await updateDoc(docRef, {
          Address: this.newAddress,
        });
      }

      if (this.newRemarks !== null) {
        await updateDoc(docRef, {
          Remarks: this.newRemarks,
        });
      }

      await updateDoc(docRef, {
        Location: this.location,
      });
      /* this.handleClose();*/
      this.$parent.display();
    },
    async handleClose() {
      console.log("close??");
      this.showModal = false;
      this.handleReset();
    },

    async handleReset() {
      (this.newSubject = ""),
        (this.newLevel = ""),
        (this.newPreferredDays = ""),
        (this.newPreferredTime = ""),
        (this.newLocation = ""),
        (this.newAddress = ""),
        (this.newRemarks = "");
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
  width: 40%;
  margin: auto;
  padding: 20px 30px;
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
}
</style>
