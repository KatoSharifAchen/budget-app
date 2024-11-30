import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBAUHX6V444xF3AjmtyfqvdcB5v8jdzjnY",
    authDomain: "expense-tracker-59ba8.firebaseapp.com",
    projectId: "expense-tracker-59ba8",
    storageBucket: "expense-tracker-59ba8.appspot.com", // Correct the storage bucket URL
    messagingSenderId: "655482335937",
    appId: "1:655482335937:web:be30069207dc6b057c1a40",
    measurementId: "G-49G5Q7W4N2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
