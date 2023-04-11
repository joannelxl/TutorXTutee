<template>
    <div class="page">
        <div class="heading">
            <h1> Tutor x Tutee </h1>
            <h4> Keep track of {{ tuteeName }}'s progress here. </h4>
        </div>
        <AddProgressNotes @added="change" />
    </div>
    
</template>
  
<script>
import AddProgressNotes from "../components/AddProgressNotes.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../firebase.js";
import { getFirestore, getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
export default {
    components: {
        AddProgressNotes,
    },
    data() {
        return {
            refreshComp: 0,
            id: null,
            tuteeName: null,
            dataLoaded: false,
        };
    },
    methods: {
        change() {
            this.refreshComp += 1;
        },
    },

    async mounted() {
        this.id = this.$route.params.id
        const auth = getAuth();
        const db = getFirestore(firebaseApp);
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                //to get tutee name
                const docRef = doc(db, "TutoringArrangements", this.id);
                try {
                    const docSnap = await getDoc(docRef);
                    const account = await getDoc(doc(db, "Tutees", docSnap.data().tuteeEmail))
                    this.tuteeName = account.data().firstName + " " + account.data().lastName
                    this.dataLoaded = true
                } catch (error) {
                    console.log(error)
                }
            }
            console.log("tuteeName: " + this.tuteeName)
        })
    },
};
</script>
  
<style scoped>
.page{
    text-align: center;
    width: 90vw
}
.heading{
    text-align: center;
}
</style>