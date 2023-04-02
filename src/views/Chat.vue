<template>
  <h1 id="Heading">Tutor X Tutee</h1>
  <div class="allChats">
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
  orderBy,
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
      var fullName;
      if (this.userRole == "tutor") {
        const chatCollection = collection(db, "Chats");
        //getting all documents in the chat collection
        const querySnapshot = await getDocs(collection(db, "Chats"));
        querySnapshot.forEach(async(document) => {
          if (document.data().TutorEmail == this.userEmail) {
            chatId = document.id;
            receiverEmail = document.data().TuteeEmail;
            //if curr user is tutor, means receiver is tutee
            const docRef = doc(db, "Tutees", receiverEmail);
            const docSnap = await getDoc(docRef);
            fullName = docSnap.data().firstName + " " + docSnap.data().lastName
            this.chats.push([fullName, "test", chatId]);
          }
        });
      } else if (this.userRole == "tutee") {
        const chatCollection = collection(db, "Chats");
        const querySnapshot = await getDocs(collection(db, "Chats"));
        querySnapshot.forEach(async(document) => {
          if (document.data().TuteeEmail == this.userEmail) {
            chatId = document.id;
            receiverEmail = document.data().TutorEmail;
            //if curr user is tutee, means receiver is tutor
            const docRef = doc(db, "Tutors", receiverEmail);
            const docSnap = await getDoc(docRef);
            fullName = docSnap.data().firstName + " " + docSnap.data().lastName
            this.chats.push([fullName, "test", chatId]);
          }
        });
      }

      //trying to get the latest message for each receiver
      //const msgRef = collection(db, "UserMessages");
      //const querySnapshot2 = query(msgRef,where("chatId", "==", chatId),orderBy("sentAt"));

      //console.log(type(querySnapshot2))
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
  border: 1px solid grey;
  padding: 20px 90px;
  display: inline-block;
  width: 500px;
  height: 50px;
  margin-left: 260px;
}
.chat {
  padding: 0;
  text-align: center;
  cursor: pointer;
  outline: none;
  background-color: transparent;
  border: none;
  border-radius: none;
  box-shadow: 0 9px transparent;
}
.chat:active {
  transform: translateY(3px);
}
.allChats {
  margin-top: 120px;
}

#Heading {
  color: black;
  top: 10px;
  width: 700px;
  margin-top: 40px;
  margin-bottom: 0px;
  margin-left: 230px;
}
</style>
