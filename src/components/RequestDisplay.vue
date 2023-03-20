<template>
  <div class="requests">
    <div class="req" v-for="request in userRequests">
      <!-- <h2>{{ index }}{{ request[1] }}</h2> -->
      <div class="card">
        <div class="container">
          <h1>{{ request[1].Subject }}</h1>

          <p>Level: {{ request[1].Level }}</p>
          <p>Preferred Days: {{ request[1].PreferredDays }}</p>
          <p>Preferred Time: {{ request[1].PreferredTime }}</p>
          <p>Location: {{ request[1].Location }}</p>
          <p>Address: {{ request[1].Address }}</p>
          <p>Remarks: {{ request[1].Remarks }}</p>

          <button @click="handleDelete(request[0])">Delete Request</button>
          <EditRequest :requestId="request[0]" />
        </div>
      </div>
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
      userRequests: [],
      userID: "testtutee@gmail.com",

      showModal: false,
    };
  },
  components: {
    EditRequest,
  },
  methods: {
    async display() {
      this.userRequests = [];
      const requestsRef = collection(db, "Requests");
      const q = query(requestsRef, where("User", "==", this.userID));
      const querySnapshot = await getDocs(q);
      console.log("displayed");
      querySnapshot.forEach((doc) => {
        this.userRequests.push([doc.id, doc.data()]);
      });
    },

    async handleDelete(requestId) {
      await deleteDoc(doc(db, "Requests", requestId));
      alert("Confirm delete");
      this.display();
    },
  },
  mounted() {
    this.display();
  },
};
</script>

<style>
.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  text-align: left;
  width: 300px;
  margin: 20px;
  background-color: #f3ddb0;
  height: 400px;
  padding-top: 30px;
}

.container {
  padding-left: 30px;
}

.requests {
  display: grid;
  grid-template-columns: auto auto auto;
  row-gap: 5px;
  column-gap: 30px;
}
</style>
