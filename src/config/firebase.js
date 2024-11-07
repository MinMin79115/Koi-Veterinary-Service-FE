import { GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA5VoMf_3xp1MNUoVQavbG6Yo6Wr4yTqqU",
    authDomain: "student-management-26f9c.firebaseapp.com",
    projectId: "student-management-26f9c",
    storageBucket: "student-management-26f9c.appspot.com",
    messagingSenderId: "559828572676",
    appId: "1:559828572676:web:9332ab18578faf1a64b351",
    measurementId: "G-NQ3VDC302N"
  };

const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const storage = new getStorage(app);
export {storage , googleProvider};

