<template>
  <div class="card" v-for="request in userRequests">
    <!-- <h2>{{ index }}{{ request[1] }}</h2> -->
    <h1>{{ request[1].Subject }}</h1>

    <p>Preferred Days: {{ request[1].PreferredDays }}</p>
    <p>Preferred Time: {{ request[1].PreferredTime }}</p>
    <p>Location: {{ request[1].Location }}</p>
    <p>Address: {{ request[1].Address }}</p>
    <p>Remarks: {{ request[1].Remarks }}</p>

    <button @click="handleDelete(request[0])">Delete</button>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { deleteDoc, getFirestore } from "firebase/firestore";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      userRequests: [],
    };
  },

  methods: {
    async display() {
      const requestsRef = collection(db, "Requests");
      const q = query(requestsRef, where("User", "==", "testtutee@gmail.com"));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        this.userRequests.push([doc.id, doc.data()]);
      });
    },

    async handleDelete(requestId) {
      await deleteDoc(doc(db, "Requests", requestId));
      alert("Confirm delete");
      location.reload();
    },
  },

  mounted() {
    this.display();
  },
};
</script>
