<!-- <template>
  <div class="cards">
    <Request
      :subject="subject"
      :preferredDays="preferredDays"
      :preferredTime="preferredTime"
      :location="location"
      :address="address"
      :remarks="remarks"
    />
  </div>
</template>

<script>
import RequestForm from "./RequestForm.vue";
import Request from "./RequestDisplay.vue";
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  components: {
    RequestForm,
    Request,
  },

  data() {
    return {
      subject: "",
      level: "",
      preferredDays: "",
      preferredTime: "",
      location: "",
      address: "",
      remarks: "",
    };
  },
  mounted() {
    async function display() {
      //change to log in user
      let userRequests = await getDocs(collection(db, "Requests"));

      userRequests.forEach((request) => {
        let documentData = request.data();
        let myDiv = document.createElement("div");
        console.log(documentData.Subject);
        this.subject = documentData.Subject;
        this.level = documentData.Level;
        this.preferredDays = documentData.PreferredDays;
        this.preferredTime = documentData.PreferredTime;
        this.location = documentData.Location;
        this.address = documentData.Address;
        this.remarks = documentData.Remarks;
        myDiv.innerHTML = "<Request />";
      });
    }

    display();
  },
};
</script>
 -->
