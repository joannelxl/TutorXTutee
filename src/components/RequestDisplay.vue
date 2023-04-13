<template>
    <div class="container" v-if="dataLoaded">
        <h1 class="empty" v-if="requests.length == 0">
        You do not have any request now. To add please click the + button
        </h1>
        <div class="filterblock" @click="showmodal">
            <b>Filter <i class='fa fa-filter' style='color: lightsteelblue'></i></b>
        </div>
        <div class="modal-mask" v-if="showModal">
            <div class="modal-container">
            <form @submit.prevent="">
                    <div class="modal-header">
                        <div class="close" @click="handleClose" style="font-size: large;">
                            <b>&times;</b>
                        </div>
                        <div style="font-size: larger;"><b>Filter based on your preferences</b></div>
                    </div><br> 
                    <div class="modal-body">
                        <div class="block">
                            <b>Location Preferences: </b>
                            <div class="options" v-for="location in locations">
                                <input type="checkbox" :value="location" v-model="selectedLocations">
                                <label>{{ location }}</label>
                            </div>
                        </div><br>
                        <div class="block">
                            <b>Subject Preferences:</b>
                            <div class="options" v-for="subject in subjects">
                                <input type="checkbox" :value="subject" v-model="selectedSubjects">
                                <label>{{ subject }}</label>
                            </div>
                        </div><br>
                        <div class="block">
                            <b>Level Preferences:</b>
                            <div class="options" v-for="level in levels">
                                <input type="checkbox" :value="level" v-model="selectedLevels">
                                <label>{{ level }}</label>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="modal-footer">
                        <div class="buttons">
                            <button class="close-btn" type="button" @click="handleClose">Cancel</button> &nbsp &nbsp &nbsp &nbsp &nbsp
                            <button class="update-btn" type="button" v-on:click="updateFilter"> Filter </button><br>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class = "req-con">
            <div class="requests" v-for="request in filteredRequests">
                <div class="cards" @click="redirectToInfo(request[0])">
                    <div style="font-size: larger;"><p><b> {{ request[2] }} </b></p></div>
                    <p><b>Level:</b> {{ request[1].Level }}</p>
                    <p><b>Subject:</b> {{ request[1].Subject }}</p>
                    <p><b>Location:</b> {{ request[1].Location }}</p>
                </div>
            </div>
        </div><br>
        <div class="message" v-if="filteredRequests.length == 0">
            There are no such listings with your preference. You can consider widening your range!
        </div>
    </div>
    
</template>

<script>
import firebaseApp from '../firebase.js';
import { collection, getDocs, getDoc, query, where, doc, getFirestore } from '@firebase/firestore';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import ConfirmDialogue from '../components/ConfirmDialogue.vue';
const db = getFirestore(firebaseApp);
export default {
    components: {
        ConfirmDialogue
    },
    data() {
        return {
            showModal: false,
            requests: [],
            filteredRequests: [],
            userEmail: null,
            dataLoaded: false,
            locations: [],
            subjects: [],
            levels: [],
            user: null,
            
            selectedLocations: [],
            selectedSubjects: [],
            selectedLevels: [],
            selection: [],
            selected: [],
        };
    },
    methods: {
        async display() {
            const auth = getAuth();
            const db = getFirestore(firebaseApp);
            const requestsRef = collection(db, "Requests");
            const q = query(requestsRef);
            const querySnapshot = await getDocs(q);
            this.filteredRequests = [];

            // for every request in the database
            // request has the following attributes: Address, Level, Location, PreferredDays, PreferredTime, Remarks, Subject, User
            
            if (this.selectedLocations.length == 0) {
                this.selectedLocations = this.locations
            }
            if (this.selectedSubjects.length == 0) {
                this.selectedSubjects = this.subjects
            }
            if (this.selectedLevels.length == 0) {
                this.selectedLevels = this.levels
            }
            var count2 = 0 
            querySnapshot.forEach(async (docu) => {
                var tuteeEmail = docu.data().User;
                var tutee = await getDoc(doc(db, "Tutees", tuteeEmail))
                // checking through all the requests to see if it has been filtered away
                var location = docu.data().Location
                var newLocation = location.charAt(0).toUpperCase() + location.slice(1)
                var subject = docu.data().Subject
                var newSubject = subject.charAt(0).toUpperCase() + subject.slice(1)
                var level = docu.data().Level
                var newLevel = level.charAt(0).toUpperCase() + level.slice(1)
                if (this.selectedLocations.includes(newLocation) &&
                    this.selectedSubjects.includes(newSubject) &&
                    this.selectedLevels.includes(newLevel)) {
                    this.filteredRequests.push([docu.id, docu.data(), tutee.data().firstName + " " + tutee.data().lastName]);
                }
                count2 += 1
                
                if (count2 == querySnapshot.size) {
                    this.selectedLocations = [];
                    this.selectedSubjects = [];
                    this.selectedLevels = [];
                    this.handleClose();
                    this.dataLoaded = true
                }
            })        
        },
        redirectToInfo(documentID) {
			this.$router.push({name: "RequestsInfo", params: {id: documentID}})
		},
        updateFilter() {
            this.display()
        },
        showmodal() {
            this.showModal = true;
            this.selectedLocations = [];
            this.selectedSubjects = [];
            this.selectedLevels = [];
        },
        handleClose() {
            this.showModal = false;
            this.handleReset();
        },
        handleReset() {
            this.selectedLocations = [];
            this.selectedSubjects = [];
            this.selectedLevels = [];
        }
    },
    mounted() {
        const auth = getAuth();
        const db = getFirestore(firebaseApp);
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user
                var tuteeEmail = ""
                var count = 0
                const requestsRef = collection(db, "Requests");
                const q = query(requestsRef);
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (docu) => {
                    tuteeEmail = docu.data().User;
                    var tutee = await getDoc(doc(db, "Tutees", tuteeEmail))
                    this.requests.push([docu.id, docu.data(), tutee.data().firstName + " " + tutee.data().lastName]);
                    var location = docu.data().Location
                    var newLocation = location.charAt(0).toUpperCase() + location.slice(1)
                    var subject = docu.data().Subject
                    var newSubject = subject.charAt(0).toUpperCase() + subject.slice(1)
                    var level = docu.data().Level
                    var newLevel = level.charAt(0).toUpperCase() + level.slice(1)
                    if (!this.locations.includes(newLocation)) {
                        this.locations.push(newLocation)
                    }
                    if (!this.subjects.includes(newSubject)) {
                        this.subjects.push(newSubject)
                    }
                    if (!this.levels.includes(newLevel)) {
                        this.levels.push(newLevel)
                    }
                })
                this.display();

            }  
        });
    }
}
</script>

<style scoped>
.cards {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    text-align: left;
    width: 40vh;
    margin: 2vh;
    background-color: white;
    padding-top: 2vh;
    padding-left: 3vh;
    padding-bottom: 2.5vh;
    padding-right: 3vh;
    cursor: pointer;
    border-radius: 10px;
    font-size: larger;
    overflow-wrap: break-word;
}
.cards:hover{
    box-shadow: 7px 7px 3px rgba(0,0,0,0.24);
}
.button{
    display: inline-block;
}
.requests{
    display: inline-block;
    grid-template-columns: auto auto auto;
    text-align: center;
    margin-top: 3vh;
    align-items: center;
}
.req-con{
    margin-left: 10vh;
    display: grid;
    grid-template-columns: auto auto auto;
}
.container{
    text-align: center;
    width: 90vw;
}
.filterFunction{
    resize: both;
}
.modal-mask{
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    transition: opacity 0.3s ease;
}
.modal-container {
    width: 25%;
    margin: auto;
    padding: 50px 50px;
    background-color: white;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}
.modal-body{
    text-align: left;
    margin-left: 12vh;
}

input {
    cursor: pointer;
}
.options {
    text-align: left;
    padding-left: 3vh;
}
.buttons{
    text-align: center;
    display: block;
    font-size: large;
}

.close-btn:hover{
    background-color: #e0dad4;
    box-shadow: 3px 3px 7px rgba(0,0,0,0.24);
}

.update-btn:hover{
    background-color: #e0dad4;
    box-shadow: 3px 3px 7px rgba(0,0,0,0.24);
}
.close {
    float: right;
    height: fit-content;
    cursor: pointer;
}
button {
	border-radius: 5px;
	padding: 10px;
	width: auto;
	text-align: left;
	margin-top: 5px;
	margin-bottom: 5px;
	border: 1px solid #000000;
	height: 40px;
	font-size: large;
	cursor: pointer;
}
.filterblock{
    float: right;
    text-align: right;
    margin-right: 20vh;
    cursor: pointer;
    font-size: larger;
}
</style>