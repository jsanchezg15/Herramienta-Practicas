import firebase from "firebase";

// Initialize Firebase

const firebaseConfig = {
	apiKey: "AIzaSyCyboSjblkUK7PiiARj79m-pw2j0f_XbOc",
	authDomain: "practicas-58334.firebaseapp.com",
	projectId: "practicas-58334",
	storageBucket: "practicas-58334.appspot.com",
	messagingSenderId: "520447416368",
	appId: "1:520447416368:web:1534fbd07f415bf7aaf5f5",
	measurementId: "G-JET91L9BBS"
};
  
const app  = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const db   = firebase.storage()

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

export { auth, db, firebase }