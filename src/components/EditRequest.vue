<template>
  <acknowledge-dialogue ref="acknowledgeDialogue"></acknowledge-dialogue>
  <button class="update-button" @click="getData">Update Request</button>

  <div v-if="showModal" class="modal-mask">
    <div class="modal-container">
      <button class="close-button" @click="handleClose">x</button>
      <div class="modal-title">
        <h1>Update your request</h1>
      </div>
      <form id="requestform" @submit.prevent="">
        <div class="modal-body">
          <label class="required">Subject:</label>
          <input type="text" :placeholder="subject" v-model="newSubject" />
          <br /><br />

          <label class="required">Level:</label>
          <input type="text" :placeholder="level" v-model="newLevel" />
          <br /><br />

          <label class="required">Preferred Day:</label>
          <input
            type="text"
            :placeholder="preferredDays"
            v-model="newPreferredDays"
          />
          <br /><br />

          <label class="required">Preferred Time:</label>
          <input
            type="text"
            :placeholder="preferredTime"
            v-model="newPreferredTime"
          />
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
            type="text"
            :placeholder="address"
            v-model="newAddress"
            rows="3"
            cols="27"
          ></textarea>
          <br /><br />

          <label>Remarks:</label>
          <textarea
            type="text"
            id="remarks"
            :placeholder="remarks"
            v-model="newRemarks"
            rows="5"
            cols="27"
          >
          </textarea>
          <br /><br />

          <button class="cancel-button" @click="handleClose">Cancel</button>
          <button class="edit-button" @click="handleEdit">
            Update Request!
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AcknowledgeDialogue from "./AcknowledgeDialogue.vue";
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
const db = getFirestore(firebaseApp);

export default {
  components: { AcknowledgeDialogue },
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

      this.newSubject = docSnap.data().Subject;
      this.newLevel = docSnap.data().Level;
      this.newPreferredDays = docSnap.data().PreferredDays;
      this.newPreferredTime = docSnap.data().PreferredTime;
      this.newLocation = docSnap.data().Location;
      this.newAddress = docSnap.data().Address;
      this.newRemarks = docSnap.data().Remarks;
    },

    async handleEdit() {
      //update the doc if there is any field filled in
      const docRef = doc(db, "Requests", this.requestId);
      console.log(this.requestId);
      console.log((await getDoc(docRef)).data());
      if (this.newSubject) {
        await updateDoc(docRef, {
          Subject: this.newSubject,
        });
      }

      if (this.newLevel) {
        await updateDoc(docRef, {
          Level: this.newLevel,
        });
      }

      if (this.newPreferredDays) {
        await updateDoc(docRef, {
          PreferredDays: this.newPreferredDays,
        });
      }

      if (this.newPreferredTime) {
        await updateDoc(docRef, {
          PreferredTime: this.newPreferredTime,
        });
      }

      if (this.newAddress) {
        await updateDoc(docRef, {
          Address: this.newAddress,
        });
      }

      await updateDoc(docRef, {
        Remarks: this.newRemarks,
      });

      await updateDoc(docRef, {
        Location: this.location,
      });

      this.handleClose();
      await this.$refs.acknowledgeDialogue.show({
        message: "Request successfully updated!",
      });
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
.update-button {
  background-color: #d9d9d9;
  padding: 10px 10px;
  border-radius: 4px;
  font-size: medium;
  border: none;
  border: solid 0.5px;
}
.update-button:hover {
  background-color: #a7a5a5;
  cursor: pointer;
}
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

label {
  float: left;
  margin-right: 30px;
}

input {
  float: right;
  height: 15px;
  width: 180px;
}

form {
  text-align: center;
  align-items: center;
  margin: auto;
}

.edit-button {
  text-align: center;
  background: #e7e5aa;
  border: 1px solid #000000;
  font-size: 20px;
  margin-left: 50px;
  float: right;
}

.cancel-button {
  text-align: center;
  background: #d9d9d9;
  border: 1px solid #000000;
  font-size: 20px;
  float: left;
}

textarea {
  resize: none;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
