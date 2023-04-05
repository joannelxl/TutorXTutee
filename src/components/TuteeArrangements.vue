<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import { doc, getDocs, getDoc, orderBy, deleteDoc } from "firebase/firestore";
import ConfirmDialogue from '../components/ConfirmDialogue.vue'

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

							// getting the chat Id corresponding to this tutor and tutee
							const q2 = query(collection(db, "Chats"), where("TutorEmail", "==", this.user.email), where("TuteeEmail", "==", document.data().tuteeEmail));
							(await getDocs(q2)).forEach((chat) => {
								arrangement.chatId = chat.id
							})
							this.arrangements.push(arrangement)
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
		async endSession(id, tuteeName) {
			const confirm = await (this.$refs.confirmDialogue).show({
				title: "End Session",
				message: "Are you sure you want to end the session with " + tuteeName + "?\nThis action cannot be undone.",
				okButton: "Confirm",
				cancelButton: "Cancel",
			})
			if (confirm) {
				const db = getFirestore(firebaseApp);
				await deleteDoc(doc(db, "TutoringArrangements", id))

				this.$emit("ended")
			}
		},
		redirectToChat(chatId) {
			this.$router.push({ name: "InChat", params: { id: chatId } })
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
			<h3>You do not have any tutees currently.</h3>
			<h3>Go and accept a request!</h3>
		</div>
		<div id="arrangements">
			<div v-for="arrangement in arrangements" :key="arrangement.tuteeEmail" class="arrangement">
				<div class="information">
					<p><strong style="font-size: x-large;">{{ arrangement.tutorName }} </strong></p>
					<text style="font-weight: bold;">Level: </text> {{ arrangement.level }} <br>
					<text style="font-weight: bold;">Subject: </text> {{ arrangement.subject }} <br>
					<div v-if="arrangement.location != 'Virtual'">
						<text style="font-weight: bold;">Address: </text> {{ arrangement.address }} <br>
					</div>
					<div v-else>
						<text style="font-weight: bold;">Location: </text> {{ arrangement.location }} <br>
					</div>
					<text style="font-weight: bold;">Day: </text> {{ arrangement.preferredDays }} <br>
					<text style="font-weight: bold;">Time: </text> {{ arrangement.preferredTime }}
				</div>
				<div class="buttons">
					<button class="chatbutton" @click="redirectToChat(arrangement.chatId)">Chat</button><br>
					<button class="progressbutton" @click="redirectToProgress(arrangement.id)">Progress</button><br>
					<button class="endsessionbutton" @click="endSession(arrangement.id, arrangement.tuteeName)">End
						Session</button>
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
	text-align: left;
	background-color: #f3ddb0;
	padding: 5px 10px;
	border-radius: 10px;
}

.arrangement {
	background-color: #f3ddb0;
	border-radius: 10px;
	padding: 10px;
	margin: 20px;
	width: 750px;
	display: block;
}

.information {
	text-align: left;
	width: 600px;
	display: inline-block;
	vertical-align: middle;
	overflow-wrap: break-word;
	padding-right: 10px;
	line-height: 3ex;
	font-size: medium;
}

.buttons {
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

button:active {
  transform: translate(1px, 1px);
}

.chatbutton {
  background-color: #8CD7E8;
}

.chatbutton:hover {
  background-color: #63b4c7;
}

.progressbutton {
  background-color: #a3cb7b;
}

.progressbutton:hover {
  background-color: #8bae68;
}

.endsessionbutton {
  background-color: #efa182;
}

.endsessionbutton:hover {
  background-color: #d08a6e;
}
</style>