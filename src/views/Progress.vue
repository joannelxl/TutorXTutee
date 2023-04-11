<template>
    <div class="page">
        <div class="heading">
            <h1>Tutor x Tutee</h1>
            <h4 v-if="dataLoaded"> 
                All your written progress for {{ tuteeName }} are listed here 
            </h4>
        </div>
        <DisplayProgress :key="refreshComp" :id="id" />
    </div>
</template>

<script>
import DisplayProgress from "../components/DisplayProgress.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../firebase.js";
import { getFirestore, getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";

export default {
    components: {
        DisplayProgress,
    },
    data() {
        return {
            refreshComp: 0,
            id: null,
            tuteeName: null,
            dataLoaded: false,
        };
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
        })
    },

    methods: {
        change() {
            this.refreshComp += 1;
        },
    }

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