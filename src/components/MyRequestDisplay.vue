<template>
  <div class="intro" v-if="dataLoaded">
    <h2 class="empty" v-if="userRequests.length == 0">
      You do not have any request now. To create, please click the '+' button.
    </h2>
    <div class="requests">
      <ConfirmDialogue ref="confirmDialogue"></ConfirmDialogue>
      <div class="req" v-for="request in userRequests" :key="request[0]">
        <!-- <h2>{{ index }}{{ request[1] }}</h2> -->
        <div class="card">
          <div class="container">
            <h1>{{ request[1].Subject }}</h1>

            <p><strong>Level:</strong> {{ request[1].Level }}</p>
            <p><strong>Preferred Day:</strong> {{ request[1].PreferredDays }}</p>
            <p><strong>Preferred Time: </strong>{{ request[1].PreferredTime }}</p>
            <p><strong>Location: </strong>{{ request[1].Location }}</p>
            <p v-if="request[1].Address.length < 20">
              <strong>Address: </strong>{{ request[1].Address }}
            </p>
            <p v-else>
              <strong>Address: </strong>{{ request[1].Address.substring(0, 20) }}...
            </p>
            <p v-if="request[1].Remarks.length < 20" class="remarks">
              <strong>Remarks: </strong>{{ request[1].Remarks }}
            </p>
            <p v-else class="remarks">
              <strong>Remarks: </strong>{{ request[1].Remarks.substring(0, 20) }}...
            </p><br>
            <div class="buttons">
              <button class="delete-button" @click="handleDelete(request[0])">
                Delete
              </button>

              <EditRequest :requestId="request[0]" />
            </div>

          </div>

        </div>
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
} from "firebase/firestore";
import EditRequest from "./EditRequest.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ConfirmDialogue from "./ConfirmDialogue.vue";
const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      userRequests: [],
      useremail: "",
      showModal: false,
      dataLoaded: false,
    };
  },
  components: {
    EditRequest,
    ConfirmDialogue,
  },
  methods: {
    async display() {
      this.userRequests = [];
      this.dataLoaded = false;
      const requestsRef = collection(db, "Requests");
      const q = query(requestsRef, where("User", "==", this.useremail));
      const querySnapshot = await getDocs(q);
      console.log("displayed");
      var count = 0
      if (querySnapshot.size == 0) {
        this.dataLoaded = true
      }
      querySnapshot.forEach((doc) => {
        this.userRequests.push([doc.id, doc.data()]);
        count += 1
        if (count == querySnapshot.size) {
          this.dataLoaded = true
        }
      });
    },

    async handleDelete(requestId) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Request",
        message:
          "Are you sure you want to delete this request? This action cannot be undone.",
        okButton: "Delete",
        cancelButton: "Cancel",
      });
      if (ok) {
        await deleteDoc(doc(db, "Requests", requestId));
        this.display();
      }
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
.intro {
  text-align: center;
  width: 90vw;
}

.empty {
  padding-top: 200px;
  text-align: center;
}

h1, p {
  padding: 0 15px;
}

.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  text-align: left;
  width: 41.5vh;
  margin: 10px;
  background-color: white;
  height: 380px;
  padding: 20px 20px;
  border-radius: 20px;
}

.remarks {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.requests {
  display: grid;
  grid-template-columns: auto auto auto;
  row-gap: 5px;
  column-gap: 30px;
  padding-left: 4vw;
}

.delete-button {
  padding: 10px 15px;
  border-radius: 8px;
  margin: 0 30px;
  border: 1px solid #2c3e50;
  font-size: large;
  float: left;
}

.delete-button:hover {
  background-color: #e0dad4;
  cursor: pointer;
}

.buttons {
  text-align: center;
}
</style>
