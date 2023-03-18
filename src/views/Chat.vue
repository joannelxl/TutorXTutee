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
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { query, where } from 'firebase/firestore';
import { getAuth } from "firebase/auth"
const db = getFirestore(firebaseApp);

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
      this.messages.push({
        email: "testtutor@gmail.com",
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
      var found = false
      querySnapshot.forEach((doc) => {
        //for each of the document in the collection
        //check if there is tutee and tutor pair in chat collection alr
        if (doc.data().TuteeEmail == "testtutee@gmail.com" && 
        doc.data().TutorEmail == "testtutor@gmail.com") {
            found = true
            //do nothing once found, dn to add document alr 
        }
      })

      //if the pair not found, then have to add a new document 
      if (found == false) {
        addDoc(chatCollection,chatsObj)
      }


      //for the messages collection
      /*const messageCollection = collection(db, "UserMessages");

      const messagesObj = {
        Email: "test",
        message: this.newMessage,
        chatId: addChat.id
      };

      const addMessage = await addDoc(messageCollection, messagesObj);

      console.log("Document created with ID: ", addMessage.id);*/
      this.newMessage = '';
    },
  },
};
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
</style>