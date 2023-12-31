<template>
  <div id="container">
    <div class="links">
      <router-link id="router" to="/Chat">Back to Chat</router-link><br /><br />
      <div class="toTuteeTutor" v-if="role">
        <router-link id="toMyTutees" to="/myTutees"
          >Back to My Tutees</router-link
        >
      </div>
      <div class="toTuteeTutor" v-else>
        <router-link id="toMyTutors" to="/myTutors"
          >Back to My Tutors</router-link
        ><br /><br />
      </div>
    </div>

    <div id="chat">
      <div>
        <img
          class="deleteIcon"
          src="@/assets/dustbin.png"
          alt=""
          @click="doDelete"
        />
        <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
      </div>
      <div id="displayname">
        <h3>{{ displayName }}</h3>
      </div>
      <div id="messagesOnly">
        <div id="display" v-if="allMessages">
          <div class="scrollable">
            <div
              id="allMessages"
              v-for="message in allMessages.slice().reverse()"
              :key="index"
            >
              <div id="senderMessages">
                <div id="sender" v-if="message[1]">
                  <p style="font-size: 16px">{{ message[0] }}</p>
                </div>
              </div>
              <div id="receiverMessages">
                <div id="receiver" v-if="message[1] == false">
                  <p style="font-size: 16px">{{ message[0] }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="inputBox">
        <form @submit.prevent="sendMessage">
          <textarea v-model="newMessage" placeholder="Send a message..." />
          <button id="button" type="submit" style="font-size: 16px">
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import {
  deleteDoc,
  getFirestore,
  onSnapshot,
  snapshotEqual,
} from "firebase/firestore";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);
import ConfirmDialogue from "./ConfirmDialogue.vue";

export default {
  name: "prevMessages",
  components: { ConfirmDialogue },
  data() {
    return {
      //role if true if current user is tutor
      role: "",
      displayName: "",
      allMessages: [],
      userEmail: "",
      chatId: "",
      receiverEmail: "",
      showModal: false,
    };
  },
  async mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userEmail = user.email;
        this.chatId = this.$route.params.id;
        this.display();
      }
    });
  },
  methods: {
    async display() {
      this.allMessages = [];
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
        this.role = true;
        receiverEmail = docSnap.data().TuteeEmail;
      } else {
        this.role = false;
        receiverEmail = docSnap.data().TutorEmail;
      }

      const msgRef = collection(db, "UserMessages");
      const querySnapshot = query(
        msgRef,
        where("chatId", "==", this.chatId),
        orderBy("sentAt")
      );

      onSnapshot(querySnapshot, (snapShot) => {
        this.allMessages = [];
        snapShot.docs.forEach((doc) => {
          if (doc.data().sender == this.userEmail) {
            this.allMessages.push([doc.data().message, true]);
          } else {
            this.allMessages.push([doc.data().message, false]);
          }
        });
      });

      //get Display name
      if (this.userRole == "tutor") {
        //means receiver is tutee
        const docRef = doc(db, "Tutees", receiverEmail);
        const docSnap = await getDoc(docRef);
        var name = docSnap.data().firstName + " " + docSnap.data().lastName;
        this.displayName = name;
      } else {
        const docRef = doc(db, "Tutors", receiverEmail);
        const docSnap = await getDoc(docRef);
        var name = docSnap.data().firstName + " " + docSnap.data().lastName;
        this.displayName = name;
      }
      //get all documents that correspond to the chat id and sender = email of the receiver
      //sort all these documents according to date and time, then push the messages into receiverMessages array
    },

    async sendMessage() {
      if (this.newMessage && this.newMessage.trim()) {
        this.allMessages.push([this.newMessage, true]);
        const messageCollection = collection(db, "UserMessages");

        const messagesObj = {
          chatId: this.chatId,
          message: this.newMessage,
          sender: this.userEmail,
          sentAt: serverTimestamp(),
        };

        addDoc(messageCollection, messagesObj);
        this.newMessage = "";
      }

      //add to firebase
      //dont need to add to the chat collection since being able to come to this page
      //means that the chat exists between sender and receiver
    },
    async doDelete() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Chat",
        message:
          "Are you sure you want to delete the chat? This action cannot be undone.",
        okButton: "Delete",
        cancelButton: "Cancel",
      });
      if (ok) {
        const querySnapshot = await getDocs(collection(db, "Chats"));

        const docRef = doc(db, "Chats", this.chatId);
        deleteDoc(docRef);

        const querySnapshot2 = await getDocs(collection(db, "UserMessages"));

        querySnapshot2.forEach((document) => {
          if (document.data().chatId == this.chatId) {
            const docRef2 = doc(db, "UserMessages", document.id);
            deleteDoc(docRef2);
          }
        });
        this.$router.push("/Chat");
      } else {
        this.$router.push("/InChat/this.chatId");
      }
    },
  },
};
</script>

<style scoped>
.links {
  float: left;
  margin-left: 5vw;
}

#chat {
  background-color: #f1dec9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  text-align: center;
  position: absolute;
  width: 920px;
  height: 600px;
  margin-left: 15vw;
  margin-top: 10px;
}

#inputBox {
  position: absolute;
  margin-top: 15vh;
  width: 780px;
  height: 100px;
  left: -70px;
  bottom: 1px;
}

textarea {
  width: 90vh;
  height: 55px;
  margin-left: 15vh;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  resize: none;
}

#button {
  position: absolute;
  background-color: white;
  left: 870px;
  bottom: 40px;
  padding: 10px;
  border: 1px solid grey;
  height: 50px;
  width: 80px;
  height: 60px;
}

.deleteIcon {
  float: right;
  position: absolute;
  margin-top: 1px;
  width: 70px;
  right: 0px;
  height: 80px;
}

#receiverMessages {
  float: left;
  margin-left: 40px;
  padding-bottom: 10px;
}

#senderMessages {
  float: right;
  margin-right: 40px;
  padding-bottom: 10px;
}

#sender,
#receiver {
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  text-align: left;
  right: 0px;
  padding: 0px 20px;
  margin-top: -28px;
  max-width: 380px;
  word-break: break-word;
  font-size: medium;
}

#router {
  margin-left: 0vw;
  /* margin-top: -10px; */
}

.scrollable {
  overflow-y: scroll;
  height: 420px;
  display: flex;
  flex-direction: column-reverse;
}

.scrollable::-webkit-scrollbar {
  width: 12px;
  /* width of the entire scrollbar */
}

.scrollable::-webkit-scrollbar-track {
  background: transparent;
  /* color of the tracking area */
  border-radius: 20px;
}

.scrollable::-webkit-scrollbar-thumb {
  background-color: #eeeded;
  /* color of the scroll thumb */
  border-radius: 20px;
  /* roundness of the scroll thumb */
  border: 2px solid #a99282;
  /* creates padding around scroll thumb */
}

.toTuteeTutor {
  margin-left: 0vw;
}
</style>
