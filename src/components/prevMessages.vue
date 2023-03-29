<template>
  <div id="Heading">Tutor X Tutee</div>
  <router-link
    id="router"
    to="/Chat"
    style="font-family: Arial, Helvetica, sans-serif"
    >Back to Chat</router-link
  >
  <div id="chat">
    <div id = "receiver">
        <h3>{{ receiverEmail }}</h3>
    </div>
    <div>
      <!--need to display this on the left eventually-->
      <div id="receiverMessages" v-for="message in receiverMessages" :key="index">
        {{ message }}
      </div>
    </div>
    <div id="inputBox">
      <form @submit.prevent="sendMessage">
        <input
          type="text"
          style="height: 35px; width: 450px"
          v-model="newMessage"
          placeholder="Send a message..." />
        <button id="button" type="submit">Send</button>
      </form>
    </div>
  </div>

  <div>
    <img
      class="deleteIcon"
      src="@/assets/dustbin.png"
      alt=""
      @click="doDelete" />
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
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

export default {
    name: 'prevMessages',
    data() {
        return {
            receiverMessages: [],
            userEmail: "",
            chatId: "",
            receiverEmail: "",
            showModal: false,
        }
    },
    async mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.userEmail = user.email;
                this.chatId = this.$route.params.id;
                this.display();
            }
        })
    }, 
    methods: {
        async display() {
            console.log("chat id is: " + this.chatId);
            var receiverEmail;
            
            //get the document that corresponds to the chatId
            const docRef = doc(db, "Chats", this.chatId);
            const docSnap = await getDoc(docRef);
            
            //get the role of the current user
            const usersRef = doc(db, "VerifiedUsers", this.userEmail);
            const userSnap = await getDoc(usersRef);
            this.userRole = userSnap.data().role;

           //get the receiver email in the chat collection
            if (this.userRole == "tutor") {
                receiverEmail = docSnap.data().TuteeEmail;
            } else {
                receiverEmail = docSnap.data().TutorEmail;
            }
            console.log("current user is: " + this.userEmail);
            console.log("receiver's email is: " + receiverEmail)


            const querySnapshot = await getDocs(collection(db, "UserMessages"));
            querySnapshot.forEach((doc) => {
                if (doc.data().chatId == this.chatId && doc.data().sender == receiverEmail) {
                    this.receiverMessages.push(doc.data().message);
                }
            })
            

            //get all documents that correspond to the chat id and sender = email of the receiver
            //sort all these documents according to date and time, then push the messages into receiverMessages array
        },
    }
}

</script>



<style scoped>
#Heading {
  color: black;
  font-size: 3em;
  font-weight: 400px;
  top: 10px;
  width: 700px;
  margin-top: 40px;
  margin-bottom: 0px;
  margin-left: 340px;
}

#chat {
  background-color: #f3ddb0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  text-align: center;

  position: absolute;
  width: 50%;
  height: 450px;
  left: 480px;
  top: 150px;
}

#inputBox {
  position: absolute;
  width: 60%;
  height: 100px;
  left: 75px;
  bottom: 1px;
}

#button {
  position: absolute;
  background-color: rgba(128, 0, 128, 0.28);
  border-radius: 100%;
  left: 480px;
  bottom: 70px;
}

.deleteIcon {
  width: 15%;
  height: 20%;
}

#receiverMessages {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 300px;
}
</style>
