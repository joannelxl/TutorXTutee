<script>
import { getAuth } from 'firebase/auth';
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import { doc, getDocs, orderBy } from "firebase/firestore";

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
		console.log(this.user)
        if (this.user) {
			const q1 = query(collection(db, "TutoringArrangements"), where("tutorEmail", "==", this.user.email), orderBy("tuteeEmail"));
			(await getDocs(q1)).forEach((doc) => {
				var data = doc.data()
				this.arrangements.push({
					tuteeEmail: data.tuteeEmail,
					subject: data.subject,
					level: data.level,
					preferredTime : data.preferredTime,
					preferredDays: data.preferredDays,
					location: data.location,
					address: data.address,
					remarks: data.remarks,
					date: data.date,
					time: data.time,
					endDate: data.endDate
				})
			})
			for (let arrangement in this.arrangements) {
				console.log(this.arrangements[arrangement].subject)
			}
			this.email = this.user.email
			//var collection = "Tutees";
            if (this.role == "tutor") {
                collection = "Tutors";
            }
			this.dataLoaded = true
        }
    }
}
</script>

<template>
	<h1>hello</h1>
	<h1>testing</h1>
</template>