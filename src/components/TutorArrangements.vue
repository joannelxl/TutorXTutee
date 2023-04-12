<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import ConfirmDialogue from "../components/ConfirmDialogue.vue";
import { doc, getDocs, getDoc, orderBy, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);
export default {
  components: { ConfirmDialogue },
  data() {
    return {
      user: false,
      email: false,
      arrangements: [],
      dataLoaded: false,
    };
  },
  async mounted() {
    const auth = getAuth();
    const db = getFirestore(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        const q1 = query(collection(db, "TutoringArrangements"), where("tuteeEmail", "==", this.user.email), orderBy("tutorEmail"));
        var size = (await getDocs(q1)).size;
        if (size > 0) {
          var count = 0;
          (await getDocs(q1)).forEach(async (document) => {
            count += 1;
            var arrangement = document.data();
            arrangement.id = document.id;

            // getting the tutorName to use later
						var account = await getDoc(doc(db, "Tutors", document.data().tutorEmail))
						arrangement.tutorName = account.data().firstName + " " + account.data().lastName
						arrangement.mode = (arrangement.location == 'Virtual') ? 'Virtual' : 'Physical'

            // getting the chat Id corresponding to this tutor and tutee
						const q2 = query(collection(db, "Chats"), where("TuteeEmail", "==", this.user.email), where("TutorEmail", "==", document.data().tutorEmail));
						(await getDocs(q2)).forEach((chat) => {
							arrangement.chatId = chat.id
						})
						if (arrangement.endDate == null) {
							this.arrangements.push(arrangement)
						} else {
							if (this.toDate(arrangement.endDate) > Date.now()) {
								this.arrangements.push(arrangement)
							} else {
								await deleteDoc(doc(db, "TutoringArrangements", arrangement.id))
							}
						}

						this.email = this.user.email
						if (count == size) {
							this.dataLoaded = true
						}
          });
        } else {
          this.dataLoaded = true;
        }
      }
    });
  },
  methods: {
    toDate(date) {
			var numbers = date.split("/")
			return new Date(numbers[2], numbers[0] - 1, numbers[1])
		},
		getDateString() {
			var today = new Date(Date.now())
			const newMonth = today.getMonth() + 2
			const string = today.getDate() + "/" + newMonth + "/" + today.getFullYear()
			return string
		},
    async endSession(id, tutorName) {
			const confirm = await (this.$refs.confirmDialogue).show({
				title: "End Session",
				message: "Are you sure you want to end the session with " + tutorName + "?\nThis action cannot be undone.",
				okButton: "Confirm",
				cancelButton: "Cancel",
			})
			if (confirm) {
				const db = getFirestore(firebaseApp);
				await updateDoc(doc(db, "TutoringArrangements", id), {
					endDate: this.getDateString()
				})
				this.$emit("ended")
			}
		},
    async redirectToChat(chatId, tuteeEmail, tutorEmail) {
      //check if chatId exist in the document. if not, create new doc
      const chatsCollection = collection(db, "Chats");
      if (chatId == undefined) {
        //create chat doc
        const chatsCollection = collection(db, "Chats");
        const chatObj = { TuteeEmail: tuteeEmail, TutorEmail: tutorEmail };
        addDoc(chatsCollection, chatObj);

        //query the chat id
        var newChatId;
        const q2 = query(
          collection(db, "Chats"),
          where("TutorEmail", "==", tutorEmail),
          where("TuteeEmail", "==", tuteeEmail)
        );
        (await getDocs(q2)).forEach((chat) => {
          newChatId = chat.id;
        });
        this.$router.push({ name: "InChat", params: { id: newChatId } });
      } else {
        this.$router.push({ name: "InChat", params: { id: chatId } });
      }
    },
    redirectToProgress(progressId) {
      this.$router.push({ name: "Progress", params: { id: progressId } });
    },
  },
};
</script>

<template>
	<confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
	<div id="tutorarrangements" v-if="dataLoaded">
		<div id="noarrangements" v-if="arrangements.length == 0">
			<h3>You do not have any tutors currently.</h3>
			<h3>Put up a request!</h3>
		</div>
		<div id="arrangements">
			<div v-for="arrangement in arrangements" :key="arrangement.tuteeEmail" class="arrangement">
				<div class="information">
					<p><strong style="font-size: x-large;">{{ arrangement.tutorName }} </strong></p>
					<text style="font-weight: bold;">Subject: </text> {{ arrangement.subject }} <br>
					<text style="font-weight: bold;">Mode: </text> {{ arrangement.mode }} <br>
					<text style="font-weight: bold;">Day: </text> {{ arrangement.preferredDays }} <br>
					<text style="font-weight: bold;">Time: </text> {{ arrangement.preferredTime }}
				</div>
				<div class="buttons">
					<button class="chatbutton" @click="
              redirectToChat(
                arrangement.chatId,
                arrangement.tuteeEmail,
                arrangement.tutorEmail
              )">Chat</button><br>
					<button class="progressbutton" @click="redirectToProgress(arrangement.id)">Progress</button><br>
					<button class="endsessionbutton" @click="endSession(arrangement.id, arrangement.tutorName)"
						v-if="arrangement.endDate == null">End
						Session</button>
					<div v-else id="endDate"> Ends on: {{ arrangement.endDate }} </div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
#tutorarrangements {
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
  display: inline-block;
}

#noarrangements {
  text-align: left;
  background-color: #f3ddb0;
  padding: 5px 10px;
  border-radius: 10px;
}

.arrangement {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  width: 750px;
  display: block;
}

.information {
	text-align: left;
	width: 540px;
	display: inline-block;
	vertical-align: middle;
	overflow-wrap: break-word;
	padding-right: 10px;
	line-height: 3ex;
	font-size: medium;
}

.buttons {
  width: 150px;
  text-align: right;
  display: inline-block;
  vertical-align: middle;
}

button {
  border-radius: 5px;
  padding: 5px;
  width: 120px;
  text-align: left;
  margin-top: 5px;
  margin-bottom: 5px;
  border: none;
  height: 40px;
  font-size: large;
  cursor: pointer;
  box-shadow: 2px 2px gray;
}

#endDate {
	padding: 5px;
	width: 150px;
	margin-top: 5px;
	margin-bottom: 5px;
	color: red;
	font-size: large;
}

button:active {
  transform: translate(1px, 1px);
}

.chatbutton {
	/* background-color: #8CD7E8; */
  background-color: #F1DEC9;
}

.chatbutton:hover {
	background-color: #63b4c7;
}

.progressbutton {
  /* background-color: #a3cb7b; */
  background-color: #F1DEC9;
}

.progressbutton:hover {
	background-color: #8bae68;
}

.endsessionbutton {
  /* background-color: #efa182; */
  background-color: #F1DEC9;
}

.endsessionbutton:hover {
	background-color: #d08a6e;
}
</style>
