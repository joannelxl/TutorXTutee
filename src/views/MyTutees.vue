<script>
import { getAuth } from 'firebase/auth';
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import { doc, getDocs, getDoc, orderBy } from "firebase/firestore";

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
		this.user = auth.currentUser
		if (this.user) {
			const q1 = query(collection(db, "TutoringArrangements"), where("tutorEmail", "==", this.user.email), orderBy("tuteeEmail"));
			(await getDocs(q1)).forEach(async (document) => {
				var arrangement = document.data()
				var account = await getDoc(doc(db, "Tutees", document.data().tuteeEmail))
				arrangement.tuteeName = account.data().lastName + " " + account.data().firstName
				this.arrangements.push(arrangement)
			})
			this.email = this.user.email
			this.dataLoaded = true
		}
	}
}
</script>

<template>
	<div id="mytutees">
		<div class="heading">
			<h1>Tutor x Tutee</h1>
			<h4> All your tutees are listed here.</h4>
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
					<button class="endsessionbutton">End Session</button>
				</div>
				<br>
			</div>
		</div>
	</div>
</template>

<style scoped> 

#mytutees {
	text-align: center;
	width: 600px;
}
.heading {
 	text-align: center;
 	align-items: center;
	padding: 10px;
 }

 #arrangements {
	padding-left: 20px;
 } 

 .arrangement {
 	background-color: #f3ddb0;
 	border-radius: 10px;
 	padding: 10px;
	display: flex;
	margin: 20px;
 }

 .information {
	text-align: left;
	width: 500px;
	float: left;
 }

 .buttons {
	text-align: right;
	width: 100px;
	float: right;
 }

 button {
	border-radius: 5px;
	padding: 5px;
	width: 100px;
	text-align: left;
	margin-top: 5px;
	margin-bottom: 5px;
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