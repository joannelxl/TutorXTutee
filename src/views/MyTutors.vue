<script>
import { getAuth } from 'firebase/auth';
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

export default {
	data() {
        return {
            user: false,
            email: false,
            role: '',
            dataLoaded: false,
			account: null,
        }
    },
	async mounted() {
        const auth = getAuth();
        const db = getFirestore(firebaseApp);
        this.user = auth.currentUser
        if (this.user) {
            const verifiedUser = await getDoc(doc(db, "VerifiedUsers", this.user.email));
            this.role = verifiedUser.data().role
			this.email = this.user.email
			var collection = "Tutees";
            if (this.role == "tutor") {
                collection = "Tutors";
            }
            const account = await getDoc(doc(db, collection, this.email));
			this.account = account.data()
			console.log(this.account.dateOfBirth)
			this.dataLoaded = true
        }
    }
}
	
</script>

<template>
	<div>
		<h1>Tutor x Tutee</h1>
	</div>
	
</template>