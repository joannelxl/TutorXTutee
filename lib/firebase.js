const firebaseConfig = {
    apiKey: "AIzaSyArkW1gkON7oQr0XwjDU0S5_0u7xRnXZ8I",
    authDomain: "tutorxtutee.firebaseapp.com",
    projectId: "tutorxtutee",
    storageBucket: "tutorxtutee.appspot.com",
    messagingSenderId: "30850755445",
    appId: "1:30850755445:web:58d66e76c9dd5bf770413c",
    measurementId: "G-9WV1LKN1P7"
  };

  firebase.initializeApp(firebaseConfig);

  var db = firebase.firestore();