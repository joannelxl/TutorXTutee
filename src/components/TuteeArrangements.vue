<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import { doc, getDocs, getDoc, orderBy, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import ConfirmDialogue from '../components/ConfirmDialogue.vue'
const db = getFirestore(firebaseApp);

export default {
	components: { ConfirmDialogue },
	data() {
		return {
			user: false,
			email: false,
			arrangements: [],
			dataLoaded: false,

		}
	},
	async mounted() {
		const auth = getAuth();
		const db = getFirestore(firebaseApp);
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				this.user = user
				const q1 = query(collection(db, "TutoringArrangements"), where("tutorEmail", "==", this.user.email), orderBy("tuteeEmail"));
				var size = (await getDocs(q1)).size
				if (size > 0) {
					var count = 0;
					(await getDocs(q1)).forEach(async (document) => {
						count += 1
						var arrangement = document.data()
						arrangement.id = document.id

						// getting the tuteeName to use later
						var account = await getDoc(doc(db, "Tutees", document.data().tuteeEmail))
						arrangement.tuteeName = account.data().firstName + " " + account.data().lastName
						arrangement.mode = (arrangement.location == 'Virtual') ? 'Virtual' : 'Physical'

						// getting the chat Id corresponding to this tutor and tutee
						const q2 = query(collection(db, "Chats"), where("TutorEmail", "==", this.user.email), where("TuteeEmail", "==", document.data().tuteeEmail));
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
					})
				} else {
					this.dataLoaded = true
				}
			}
		})
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
		async endSession(id, tuteeName) {
			const confirm = await (this.$refs.confirmDialogue).show({
				title: "End Session",
				message: "Are you sure you want to end the session with " + tuteeName + "?" + '\n' + "This action cannot be undone.",
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
                const chatObj = {TuteeEmail: tuteeEmail, TutorEmail: tutorEmail}
                addDoc(chatsCollection, chatObj);

                //query the chat id
                var newChatId;
                const q2 = query(collection(db, "Chats"), where("TutorEmail", "==", tutorEmail), where("TuteeEmail", "==", tuteeEmail));
				(await getDocs(q2)).forEach((chat) => {
				    newChatId = chat.id
				})
                this.$router.push({ name: "InChat", params: { id: newChatId } })
            } else {
                this.$router.push({ name: "InChat", params: { id: chatId } })
            }
		},
		redirectToProgress(progressId) {
			this.$router.push({ name: "Progress", params: { id: progressId } })
		}
	}
}
</script>

<template>
	<confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
	<div id="tuteearrangements" v-if="dataLoaded">
		<div id="noarrangements" v-if="arrangements.length == 0">
			<h2>You do not have any tutees currently.</h2>
			<h2>Go and accept a request!</h2>
		</div>
		<div id="arrangements">
			<div v-for="arrangement in arrangements" :key="arrangement.tuteeEmail" class="arrangement">
				<div class="information">
					<p><strong style="font-size: x-large;">{{ arrangement.tuteeName }} </strong></p>
					<text style="font-weight: bold;">Level: </text> {{ arrangement.level }} <br>
					<text style="font-weight: bold;">Subject: </text> {{ arrangement.subject }} <br>
					<text style="font-weight: bold;">Mode: </text> {{ arrangement.mode }} <br>
					<div v-if="arrangement.location != 'Virtual'">
						<text style="font-weight: bold;">Address: </text> {{ arrangement.address }} <br>
					</div>
					<text style="font-weight: bold;">Day: </text> {{ arrangement.preferredDays }} <br>
					<text style="font-weight: bold;">Time: </text> {{ arrangement.preferredTime }}
				</div>
				<div class="buttons">
					<button class="chatbutton" @click="redirectToChat(arrangement.chatId, arrangement.tuteeEmail, arrangement.tutorEmail)">Chat</button><br>
					<button class="progressbutton" @click="redirectToProgress(arrangement.id)">Progress</button><br>
					<button class="endsessionbutton" @click="endSession(arrangement.id, arrangement.tuteeName)"
						v-if="arrangement.endDate == null">End
						Session</button>
					<div v-else id="endDate"> Ends on: {{ arrangement.endDate }} </div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
#tuteearrangements {
	font-family: Arial, Helvetica, sans-serif;
	text-align: center;
	display: inline-block;
}

#noarrangements {
  text-align: center;
  margin-top: 200px;
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
  background-color: #F1DEC9;
}

.chatbutton:hover {
	background-color: #C8B6A6;
}

.progressbutton {
  background-color: #F1DEC9;
}

.progressbutton:hover {
	background-color: #C8B6A6;
}

.endsessionbutton {
  background-color: #F1DEC9;
}

.endsessionbutton:hover {
	background-color: #C8B6A6;
}
</style>