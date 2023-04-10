<template>
  <div class="intro" v-if="dataLoaded">
    <h1 class="empty" v-if="userRequests.length == 0">
      You do not have any request now. To add please click the + button
    </h1>
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
            <p class="remarks">
              <strong>Remarks: </strong>{{ request[1].Remarks }}
            </p>

            <button class="delete-button" @click="handleDelete(request[0])">
              Delete Request
            </button>

            <EditRequest :requestId="request[0]" />
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
  getDoc,
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
        okButton: "Confirm deletion",
        cancelButton: "Go Back",
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
}

.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  text-align: left;
  width: 31.5vh;
  margin: 20px;
  background-color: #f3ddb0;
  height: 420px;
  padding-top: 30px;
}

.remarks {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.container {
  padding-left: 30px;
}

.requests {
  display: grid;
  grid-template-columns: auto auto auto;
  row-gap: 5px;
  column-gap: 30px;
  padding-left: 8vw;
}

.delete-button {
  background-color: #f7a588;
  padding: 10px 10px;
  border-radius: 4px;
  font-size: medium;
  margin-left: -13px;
  margin-right: 5px;
  margin-top: 10px;
  border: none;
  border: solid 0.5px;
}

.delete-button:hover {
  background-color: #d08a6e;
  cursor: pointer;
}
</style>
