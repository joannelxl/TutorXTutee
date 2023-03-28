<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import { doc, getDocs, getDoc, orderBy, deleteDoc } from "firebase/firestore";

export default {
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
				(await getDocs(q1)).forEach(async (document) => {
					var arrangement = document.data()
					var account = await getDoc(doc(db, "Tutees", document.data().tuteeEmail))
					arrangement.tuteeName = account.data().firstName + " " + account.data().lastName
					arrangement.id = document.id
					this.arrangements.push(arrangement)
					this.arrangements.push(arrangement)
					this.arrangements.push(arrangement)
				})
				this.email = this.user.email
				this.dataLoaded = true
			}
		})
	},
	methods: {
		async endSession(id, tuteeName) {
			if (confirm("Are you sure you want to end the session with " + tuteeName + "?\nThis action cannot be undone.")) {
				const db = getFirestore(firebaseApp);
				await deleteDoc(doc(db, "TutoringArrangements", id))

				this.$emit("ended")
			}
		}
	}
}
</script>

<template>
	<div id="tuteearrangements">
		<div id="noarrangements" v-if="arrangements.length == 0">
			<h3>You do not have any tutees currently.</h3>
		</div>
		<div id="arrangements" v-if="dataLoaded">
			<div v-for="arrangement in arrangements" :key="arrangement.tuteeEmail" class="arrangement">
				<div class="information">
					<strong style="font-size: larger;">{{ arrangement.tuteeName }} </strong><br>
					Level: {{ arrangement.level }} <br>
					Subject: {{ arrangement.subject }} <br>
					Address: {{ arrangement.address }} <br>
					Day: {{ arrangement.preferredDays }} <br>
					Time: {{ arrangement.preferredTime }}
				</div>
				<div class="buttons">
					<button class="chatbutton">Chat</button><br>
					<button class="progressbutton">Progress</button><br>
					<button class="endsessionbutton" @click="endSession(arrangement.id, arrangement.tuteeName)">End
						Session</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
#tuteearrangements {
	text-align: center;
	display: inline-block;
}

#noarrangements {
	text-align: center;
}

.arrangement {
	background-color: #f3ddb0;
	border-radius: 10px;
	padding: 10px;
	margin: 20px;
	width: 600px;
	display: block;
}

.information {
	text-align: left;
	width: 500px;
	display: inline-block;
	vertical-align: middle;
}

.buttons {
	text-align: right;
	display: inline-block;
	vertical-align: middle;
}

button {
	border-radius: 5px;
	padding: 5px;
	width: 100px;
	text-align: left;
	margin-top: 5px;
	margin-bottom: 5px;
	border: none;
	height: 30px;
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