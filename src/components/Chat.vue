<template>
  <div id="chat">
    <div>
      <div v-for="(message, index) in messages" :key="index">
        {{ message.name }}: {{ message.text }}
      </div>
    </div>
    <div id="inputBox">
      <form @submit.prevent="sendMessage">
        <input
          type="text"
          style="height: 35px; width: 350px"
          v-model="newMessage"
          placeholder="Send a message..."/>
        <button id="button" type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
const db = getFirestore(firebaseApp);


export default {
  data() {
    return {
      messages: [
        { name: "Yi Wei", text: "hello!!" },
        { name: "You", text: "what u want" },
      ],
      newMessage: "",
    };
  },
  methods: {
    async sendMessage() {
      this.messages.push({
        name: "You",
        text: this.newMessage,
      });

      //for the chat collection
      const colRef2 = collection(db, "Chats");
      const chatsObj = {
        TuteeName: "YiWei",
        TutorName: "Kelly"
      };
      const docRef2 = await addDoc(colRef2, chatsObj);

      //for the messages collection
      const colRef = collection(db, "UserMessages");

      const messagesObj = {
        name: "test",
        message: this.newMessage,
        chatId: docRef2.id
      };

      const docRef = await addDoc(colRef, messagesObj);

      console.log("Document created with ID: ", docRef.id);
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
  left: 320px;
  top: 60px;
}

#inputBox {
  position: absolute;
  width: 60%;
  height: 100px;
  left: 100px;
  bottom: 1px;
}

#button {
  position: absolute;
  background-color: rgba(128, 0, 128, 0.28);
  border-radius: 100%;
}
</style>
