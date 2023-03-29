<template>
  <div class="chats">
    <button class="chat" v-for="chat in chats" v-on:click="toMessages(chat)">
      <div class="container">
        <!-- chat[0] is name, chat[1] is latest message, chat[3] is chatid -->
        <h1>{{ chat[0] }}</h1>
        <!--<h2>{{ chat[1] }}</h2>-->
      </div>
      <!--<prevMessages :receiverEmail="chat[0]"/>-->
    </button>
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);
import prevMessages from "../components/prevMessages.vue";

export default {
  components: {
    prevMessages,
  },
  data() {
    return {
      chats: [],
      userEmail: "",
      showModal: false,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userEmail = user.email;
        this.display();
      }
    });
  },
  methods: {
    async display() {
      this.chats = [];
      //const auth = getAuth();
      const usersRef = doc(db, "VerifiedUsers", this.userEmail);
      const docSnap = await getDoc(usersRef);
      //get the role
      this.userRole = docSnap.data().role;

      //for userMessages to use
      var chatId;
      var receiverEmail;
      if (this.userRole == "tutor") {
        const chatCollection = collection(db, "Chats");
        //getting all documents in the chat collection
        const querySnapshot = await getDocs(collection(db, "Chats"));
        querySnapshot.forEach((doc) => {
          if (doc.data().TutorEmail == this.userEmail) {
            chatId = doc.id;
            receiverEmail = doc.data().TuteeEmail;
            this.chats.push([receiverEmail, "test", chatId]);
          }
        });
      } else if (this.userRole == "tutee") {
        const chatCollection = collection(db, "Chats");
        const querySnapshot = await getDocs(collection(db, "Chats"));
        querySnapshot.forEach((doc) => {
          if (doc.data().TuteeEmail == this.userEmail) {
            chatId = doc.id;
            receiverEmail = doc.data().TutorEmail;
            this.chats.push([receiverEmail, "test", chatId]);
          }
        });
      }
    },
    toMessages(chat) {
      console.log(chat[2]);
      this.$router.push({ name: "InChat", params: { id: chat[2] } });
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #f3ddb0;
  text-align: center;
  justify-content: center;
  border: 1px solid;
  padding: 30px 100px;
  display: inline-block;
  width: 300px;
  height: 30px;
}
</style>