import {initializeApp} from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import {getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBhiv1CP6kEuSCFWNAA-HdnA2w97_6vy4o",
    authDomain: "shivraj-4c835.firebaseapp.com",
    databaseURL: "https://shivraj-4c835-default-rtdb.firebaseio.com",
    projectId: "shivraj-4c835",
    storageBucket: "shivraj-4c835.appspot.com",
    messagingSenderId: "837473812572",
    appId: "1:837473812572:web:63d897976d50f50d922699"
  };


const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const db = getFirestore(app);

const auth = getAuth(app);
export default db;
export {auth , provider , app};