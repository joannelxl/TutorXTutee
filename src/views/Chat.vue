<template>
  <div class="intro">
    <h1>Tutor X Tutee</h1>
    <h4>All your chats are listed here.</h4>
  </div>
  <div v-if="dataLoaded">
  <h1 class="empty" v-if="chats.length == 0">
      You do not have any chats now.
  </h1>
  
  <div class="allChats">
    <button class="chat" v-for="chat in chats" v-on:click="toMessages(chat)">
      <div class="container">
        <!-- chat[0] is name, chat[1] is latest message, chat[3] is chatid -->
        <h1 style = "font-size: 19px;">{{ chat[0] }}</h1>
        <p style = "font-size: 14px;">{{ chat[1] }}</p>
        <!--<h2>{{ chat[1] }}</h2>-->
      </div>
      <!--<prevMessages :receiverEmail="chat[0]"/>-->
    </button>
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
  orderBy,
  limit,
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
      dataLoaded: false
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
      var receiverEmail;

      const chatCollection = collection(db, "Chats");
      //getting all documents in the chat collection
      const querySnapshot = await getDocs(chatCollection);
      var count = 0
      var size = querySnapshot.size

      if (size == 0) {
        this.dataLoaded = true
      }

      if (this.userRole == "tutor") {
        querySnapshot.forEach(async (document) => {
          if (document.data().TutorEmail == this.userEmail) {
            var chatId = document.id;
            receiverEmail = document.data().TuteeEmail;
            //if curr user is tutor, means receiver is tutee
            const docRef = doc(db, "Tutees", receiverEmail);
            const docSnap = await getDoc(docRef);
            var fullName =
              docSnap.data().firstName + " " + docSnap.data().lastName;

            const msgRef = collection(db, "UserMessages");
            const querySnapshot2 = query(
              msgRef,
              where("chatId", "==", chatId),
              orderBy("sentAt", "desc"),
              limit(1)
            );
            var size2 = (await getDocs(querySnapshot2)).size
            if (size2 == 0) {
              count += 1
            } else {
              var latestMessage;
              (await getDocs(querySnapshot2)).forEach((document) => {
                latestMessage = document.data().message;
                count += 1
              });
              this.chats.push([fullName, latestMessage, chatId]);
            }
          } else {
            count += 1
          }
          if (count == size) {
            this.dataLoaded = true
          }
        });
      } else if (this.userRole == "tutee") {
        querySnapshot.forEach(async (document) => {
          if (document.data().TuteeEmail == this.userEmail) {
            var chatId = document.id;
            receiverEmail = document.data().TutorEmail;
            //if curr user is tutee, means receiver is tutor
            const docRef = doc(db, "Tutors", receiverEmail);
            const docSnap = await getDoc(docRef);
            var fullName =
              docSnap.data().firstName + " " + docSnap.data().lastName;

            //get latest message
            const msgRef = collection(db, "UserMessages");
            const querySnapshot2 = query(
              msgRef,
              where("chatId", "==", chatId),
              orderBy("sentAt", "desc"),
              limit(1)
            );
            var size2 = (await getDocs(querySnapshot2)).size
            if (size2 == 0) {
              count += 1
            } else {
              var latestMessage;
              (await getDocs(querySnapshot2)).forEach((document) => {
                latestMessage = document.data().message;
                count += 1
              });
              this.chats.push([fullName, latestMessage, chatId]);
            }
          } else {
            count += 1
          }
          if (count == size) {
            this.dataLoaded = true
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
  border: 1px solid grey;
  padding: 10px 70px;
  width: 500px;
  height: 80px;
  margin-left: 280px;
}
.chat {
  margin-top: -1px;
  margin-bottom: -1px;
  cursor: pointer;
  outline: none;
  background-color: transparent;
  border: none;
  border-radius: none;
  box-shadow: 0 9px transparent;
  text-align: left;
}
.chat:active {
  transform: translateY(3px);
}
.allChats {
  margin-top: 100px;
  text-align: center;
}

.intro {
  text-align: center;
  width: 1200px;
}

.empty {
  text-align: center;
  margin-top: 200px;
  width: 1200px
}
</style>
