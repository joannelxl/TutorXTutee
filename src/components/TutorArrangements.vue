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
				const q1 = query(collection(db, "TutoringArrangements"), where("tuteeEmail", "==", this.user.email), orderBy("tutorEmail"));
				(await getDocs(q1)).forEach(async (document) => {
					var arrangement = document.data()
					arrangement.id = document.id

					// getting the tutorName to use later
					var account = await getDoc(doc(db, "Tutors", document.data().tutorEmail))
					arrangement.tutorName = account.data().firstName + " " + account.data().lastName

					// getting the chat Id corresponding to this tutor and tutee
					const q2 = query(collection(db, "Chats"), where("TuteeEmail", "==", this.user.email), where("TutorEmail", "==", document.data().tutorEmail));
					(await getDocs(q2)).forEach((chat) => {
						arrangement.chatId = chat.id
					})
					this.arrangements.push(arrangement)
					this.email = this.user.email
				})
				this.dataLoaded = true
			}
		})
	},
	methods: {
		async endSession(id, tutorName) {
			/*const confirm = await (this.$refs.confirmDialogue).show({
				title: "End Session",
				message: "Are you sure you want to end the session with " + tuteeName + "?\nThis action cannot be undone.",
				okButton: "Confirm",
			})
			if (confirm) {
				console.log("delete")
			}
			*/
			if (confirm("Are you sure you want to end the session with " + tutorName + "?\nThis action cannot be undone.")) {
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
	<div id="tutorarrangements" v-if="dataLoaded">
		<div id="noarrangements" v-if="arrangements.length == 0">
			<h3>You do not have any tutors currently.</h3>
			<h3>Put up a request!</h3>
		</div>
		<div id="arrangements">
			<div v-for="arrangement in arrangements" :key="arrangement.tuteeEmail" class="arrangement">
				<div class="information">
					<p><strong style="font-size: x-large;">{{ arrangement.tutorName }} </strong></p>
					<text style="font-weight: bold;">Level: </text> {{ arrangement.level }} <br>
					<text style="font-weight: bold;">Subject: </text> {{ arrangement.subject }} <br>
					<text style="font-weight: bold;">Address: </text> {{ arrangement.address }} <br>
					<text style="font-weight: bold;">Day: </text> {{ arrangement.preferredDays }} <br>
					<text style="font-weight: bold;">Time: </text> {{ arrangement.preferredTime }}
				</div>
				<div class="buttons">
					<button class="chatbutton" @click="redirectToChat(arrangement.chatId)">Chat</button><br>
					<button class="progressbutton" @click="redirectToProgress(arrangement.id)">Progress</button><br>
					<button class="endsessionbutton" @click="endSession(arrangement.id, arrangement.tutorName)">End
						Session</button>
					<confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
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

button:hover {
	background-color: white;
}

button:active {
	transform: translate(1px, 1px);
}

.chatbutton {
	background-color: #8CD7E8;

}

.progressbutton {
	background-color: #a3cb7b;
}

.endsessionbutton {
	background-color: #efa182;
}
</style>