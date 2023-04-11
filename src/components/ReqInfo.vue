<template>
	<confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
    <div class="page" v-if="dataLoaded">
        <button class="chatButton" type="button" v-on:click="redirectToChat">
            <i class="fas fa-comments"></i> Chat 
        </button>
        <router-link id="router" to="/Requests" style="font-family: Arial, Helvetica, sans-serif">
            Back to Requests
        </router-link>
        <!--div class="backButton" @click="this.$router.go(-1)">
            <b>&lt; Return to Requests</b>
        </div-->
        
        <div class="card-container">
            <div class="card">
                <div style="font-size: larger;"><p><b> {{ req.name }} </b></p></div>
                <p><b>Level:</b> {{ req.Level }}</p>
                <p><b>Subject:</b> {{ req.Subject }}</p>
                <p><b>Location:</b> {{ req.Location }}</p>
                
                <div class="additional-info">
                    <p><b>Preferred Day:</b> {{ req.PreferredDays }}</p>
                    <p><b>Preferred Time:</b> {{ req.PreferredTime }}</p>
                   
                    <p><b>Remarks:</b> {{ req.Remarks }}</p>
                </div>
            </div>
        </div> 
        
        <br>
        <div class="buttons"> 
            <button class="acceptRequestButton" type="button" style="font-size: large;" v-on:click="acceptRequest(req)"> Accept this Request </button>
        </div>
    </div>
</template>

<script>
import firebaseApp from '../firebase';

import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { collection, getDocs, doc, query, getFirestore, getDoc, where, addDoc, deleteDoc } from '@firebase/firestore';
import ConfirmDialogue from './ConfirmDialogue.vue';

export default {
    components: {
        ConfirmDialogue
    },

	data() {
		return {
            user: false,
			id: null,
            dataLoaded: false,
            chatID: null,
            req: null,

		}
	},
	mounted() {
        this.id = this.$route.params.id // this will be the request document id
        const auth = getAuth();
        const db = getFirestore(firebaseApp);
        onAuthStateChanged(auth, async (user) => {
            if (user) { // this user must be a tutor to access the Requests page
                //console.log(user.email);
                this.user = user
                const q = await getDoc(doc(db, "Requests", this.id))
                this.req = q.data();
                var request = q.data();
                this.req.tuteeEmail = this.req.User;
                
                
                const q2 = await getDoc(doc(db, "Tutees", this.req.tuteeEmail));
                this.req.name = q2.data().firstName + " " + q2.data().lastName;
                this.dataLoaded = true;
                /*
                // if chat exists
                //const q3 = query(collection(db, "Chats"), where("TutorEmail", "==", this.user.email), where("TuteeEmail", "==", document.data().tuteeEmail));
                const q3 = query(collection(db, "Chats"), where("TuteeEmail", "==", this.userEmail), where("TutorEmail", "==", user.email));
                // , where("TuteeEmail", "==", this.userEmail), where("TutorEmail", "==", user.email)
                
                if ((await getDocs(q3)).empty) {
                    console.log("here")
                    const docRef = await addDoc(collection(db, "Chats"), {
                        TuteeEmail: this.userEmail,
                        TutorEmail: user.email,
                    });
                    console.log("Document written with ID: ", docRef.id);
                    this.chatID = docRef.id;
                } else {
                    (await getDocs(q3)).forEach((doc) => {
                        var chat = doc.data();
                        chat.id = doc.id;
                        this.chatID = chat.id;
                    })
                }*/
            }
        })
	},
    methods: {
        async redirectToChat(){
            const auth = getAuth();
            const db = getFirestore(firebaseApp);
            
            const tutorRef = await getDoc(doc(db, "Tutors", this.user.email))
            console.log(tutorRef.data())
            if (tutorRef) {
                // this user must be a tutor to access the Requests page
                // if chat exists
                //const q3 = query(collection(db, "Chats"), where("TutorEmail", "==", this.user.email), where("TuteeEmail", "==", document.data().tuteeEmail));
                const q3 = query(collection(db, "Chats"), where("TuteeEmail", "==", this.req.tuteeEmail), where("TutorEmail", "==", this.user.email));
                // , where("TuteeEmail", "==", this.userEmail), where("TutorEmail", "==", user.email)
                // if chat doesnt exist:
                if ((await getDocs(q3)).empty) {
                    console.log("here")
                    const docRef = await addDoc(collection(db, "Chats"), {
                        TuteeEmail: this.req.tuteeEmail,
                        TutorEmail: this.user.email,
                    });
                    console.log("Document written with ID: ", docRef.id);
                    this.chatID = docRef.id;
                    this.$router.push({name: "InChat", params: {id: this.chatID}})
                } else {
                    (await getDocs(q3)).forEach((doc) => {
                        var chat = doc.data();
                        chat.id = doc.id;
                        this.chatID = chat.id;
                    })
                    this.$router.push({name: "InChat", params: {id: this.chatID}})
                }
            } else {
                console.log("not logged in")
            }
        },

        redirectToMyTutees() {
            this.$router.push({ path: '/MyTutees'})
        },

        async acceptRequest(req) {
            console.log("within acceptRequest function")
            const confirm = await (this.$refs.confirmDialogue).show({
                title: "Accept Request",
                message: "Are you sure you want to accept this request?",
                okButton: "Accept", 
                cancelButton: "Cancel"
            })
            if (confirm) {
                // attributes of req: User (email), Location, PreferredTime, Subject, PreferredDays, Address, Remarks, Level
                const auth = getAuth();
                const db = getFirestore(firebaseApp);
                const tutorRef = await getDoc(doc(db, "Tutors", this.user.email))
                console.log(tutorRef.data())
                if (tutorRef) {
                    // to add this request into TutoringArrangements collection
                    const tutArrRef = await addDoc(collection(db, "TutoringArrangements"), {
                        address: this.req.Address,
                        level: this.req.Level,
                        location: this.req.Location,
                        preferredDays: this.req.PreferredDays,
                        preferredTime: this.req.PreferredTime,
                        subject: this.req.Subject,
                        tuteeEmail: this.req.tuteeEmail,
                        tutorEmail: this.user.email,
                        
                    });
                    console.log("Document written with URGH ID: ", tutArrRef.id);
                    // to remove this request from Requests collection
                    await deleteDoc(doc(db, "Requests", this.id));
                }
                this.$emit("accepted")
                this.$router.push({ path: '/MyTutees'});
            }
            
        }
    }
}
</script>

<style scoped>
.card{
    width: 50vh;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    text-align: left;
    margin-top: 8vh;
    background-color: #f3ddb0;
    padding: 20px;
    border-color: #f3ddb0;
    border-radius: 10px;
    overflow-wrap: break-word;
    font-size: large;
}

.card-container{
    margin-left: 61vh;
    margin-top: 3vh;
    display: grid;
    grid-template-columns: auto auto auto;
}

.heading{
    text-align: center;
}

#router{
    text-align: left;
    margin-left: 25vh;
    margin-top: 2vh;
    cursor: pointer;
    font-size: large;
    float: left;
}

.chatButton{
    text-align: center;
    margin-right: 25vh;
    font-size: large;
    float: right;
    background-color: #8CD7E8;
    padding-left: 18px;
    padding-right: 18px;
}

.chatButton:hover{
    background-color: #40a4bb;
}

.page{
    text-align: center;
    display: block;
}

.buttons{
    text-align: center;
    display: block;
    font-size: large;
}

.acceptRequestButton{
    text-align: center;
    margin-top: 2vh;
    background-color: #e4ade4;
}

.acceptRequestButton:hover{
    background-color: #cd7ccd;
}

button {
	border-radius: 5px;
	padding: 5px;
	width: auto;
	text-align: left;
	margin-top: 5px;
	margin-bottom: 5px;
	border: none;
	height: 40px;
	font-size: large;
	cursor: pointer;
	box-shadow: 2px 2px gray;
}


</style>