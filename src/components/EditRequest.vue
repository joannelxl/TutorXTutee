<template>
  <acknowledge-dialogue ref="acknowledgeDialogue"></acknowledge-dialogue>
  <button class="update-button" @click="getData">Update</button>

  <div v-if="showModal" class="modal-mask">
    <div class="modal-container">
      <button class="close-button" @click="handleClose">x</button>
      <div class="modal-title">
        <h2>Update your request</h2>
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
          <br />

          <label class="required">Address:</label>
          <textarea
            type="text"
            :placeholder="address"
            v-model="newAddress"
            rows="3"
            cols="27"
          ></textarea>
          <br />

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
          <br /><br>

          <button class="cancel-button" @click="handleClose">Cancel</button>
          <button class="edit-button" @click="handleEdit">
            Update request
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AcknowledgeDialogue from "./AcknowledgeDialogue.vue";
import firebaseApp from "../firebase.js";
import { getFirestore, updateDoc } from "firebase/firestore";
import { getDoc, doc} from "firebase/firestore";
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
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #2c3e50;
  /* border: none; */
  margin: 0 30px;
  font-size: large;
  float: right;
}
.update-button:hover {
  background-color: #e0dad4;
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
  padding: 40px 20px;
  /* background-color: #F1DEC9; */
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.close-button {
  float: right;
  font-size: 20px;
  cursor: pointer;
  border: 1px solid #000000;
  border-radius: 5px;
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
  height: 30px;
  width: 212px;
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

form {
  text-align: center;
  align-items: center;
  margin: auto;
}

.edit-button, .cancel-button {
  text-align: center;
  /* background-color: #a3cb7b; */
  border: 1px solid #000000;
  font-size: medium;
  border-radius: 5px;
	padding: 10px;
  margin: 0 30px;
}

.edit-button {
  float: right;
}

.cancel-button {
  float: left;
}

.edit-button:hover, .cancel-button:hover, .close-button:hover {
  background-color: #e0dad4;
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
</style>
