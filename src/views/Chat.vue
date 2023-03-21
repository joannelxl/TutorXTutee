<template>
  <div id="chat">
    <div>
      <div v-for="(message, index) in messages" :key="index">
        {{ message.email }}: {{ message.text }}
      </div>
    </div>
    <div id="inputBox">
      <form @submit.prevent="sendMessage">
        <input
          type="text"
          style="height: 35px; width: 450px"
          v-model="newMessage"
          placeholder="Send a message..."/>
        <button id="button" type="submit">Send</button>
      </form>
    </div>
  </div>

  <div>
    <img class="deleteIcon" src="@/assets/dustbin.png" alt="" v-on:click = "deleteChat">
    <confirm-dialogue ref = "confirmDialogue"></confirm-dialogue>
  </div>

</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { query, where } from 'firebase/firestore';
import { getAuth } from "firebase/auth"
const db = getFirestore(firebaseApp);
import ConfirmDialogue from "../components/ConfirmDialogue.vue";

/*getAuth().onAuthStateChanged(user => {
    if (user) {
        console.log("user is logged in")
        console.log(user)
        var emailOfCurrUser = user.email
        console.log(emailOfCurrUser)
    }
    else {
        console.log("not signed in")
    }
})*/


export default {
  components: { ConfirmDialogue },

  data() {
    return {
      messages: [
        { email: "testtutee@gmail.com", text: "hello!!" },
        { email: "testtutor@gmail.com", text: "what u want" },
      ],
      newMessage: "",
    };
  },
  methods: {
    async sendMessage() {

      const auth = getAuth();
      const userEmail = auth.currentUser.email;

      this.messages.push({
        email: userEmail,
        text: this.newMessage,
      });

      //for the chat collection
      const chatCollection = collection(db, "Chats");
      const chatsObj = {
        TuteeEmail: "testtutee@gmail.com",
        TutorEmail: "testtutor@gmail.com"
      };

      //getting all documents in the chat collection
      const querySnapshot = await getDocs(collection(db, "Chats"));
      //retrieve chatid for messages to use
      var corresChatId;
      var found = false
      querySnapshot.forEach((doc) => {
        //for each of the document in the collection
        //check if there is tutee and tutor pair in chat collection alr
        if (doc.data().TuteeEmail == "testtutee@gmail.com" && 
        doc.data().TutorEmail == "testtutor@gmail.com") {
            found = true;
            corresChatId = doc.id
            //do nothing once found, dn to add document alr 
        }
      })

      //if the pair not found, then have to add a new document 
      if (found == false) {
        addDoc(chatCollection,chatsObj)
        const querySnapshot = await getDocs(collection(db, "Chats"));
        querySnapshot.forEach((doc) => {
            if (doc.data().TuteeEmail == "testtutee@gmail.com" &&
            doc.data().TutorEmail == "testtutor@gmail.com") {
                corresChatId = doc.id
            }
        })
        console.log("a new chat document has been added")
        }
      

      //for the messages collection
      const messageCollection = collection(db, "UserMessages");

      var today = new Date();
      var sendTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

      const messagesObj = {
        chatId: corresChatId,
        message: this.newMessage,
        sender: userEmail,
        time: sendTime
      };

      addDoc(messageCollection, messagesObj)
      console.log("a new UserMessage document has been added")
    

      this.newMessage = '';

    }, 
    
    async deleteChat() {
    const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Chat",
        message: "Are you sure you want to delete the chat? This action cannot be undone.",
        okButton: "Delete",
    })

    if (ok) {
        const querySnapshot = await getDocs(collection(db, "Chats"));
        //retrieve chatid for messages to use
        var corresChatId;

        querySnapshot.forEach((document) => {
            //for each of the document in the collection
            //check if there is tutee and tutor pair in chat collection alr
            if (document.data().TuteeEmail == "testtutee@gmail.com" && 
            document.data().TutorEmail == "testtutor@gmail.com") {
                const docRef = doc(db, "Chats", document.id)
                deleteDoc(docRef)
                corresChatId = document.id
                console.log("successfully deleted chats doc")
            }
        })

        const querySnapshot2 = await getDocs(collection(db, "UserMessages"));

        querySnapshot2.forEach((document) => {
            if (document.data().chatId == corresChatId) {
                const docRef2 = doc(db, "UserMessages", document.id)
                deleteDoc(docRef2)
                console.log("successfully deleted userMessage doc")
            }
        })
        this.$router.push("/AllChats")
    }
    else {
        this.$router.push("/Chat")
    }
}
}
}
</script>

<style scoped>
#chat {
  background-color: #f3ddb0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  text-align: center;

  position: absolute;
  width: 50%;
  height: 450px;
  left: 340px;
  top: 60px;
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



</style>