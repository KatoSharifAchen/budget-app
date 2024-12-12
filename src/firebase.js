import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBAUHX6V444xF3AjmtyfqvdcB5v8jdzjnY",
    authDomain: "expense-tracker-59ba8.firebaseapp.com",
    projectId: "expense-tracker-59ba8",
    storageBucket: "expense-tracker-59ba8.appspot.com",
    messagingSenderId: "655482335937",
    appId: "1:655482335937:web:be30069207dc6b057c1a40",
    measurementId: "G-49G5Q7W4N2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable Firestore persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
        console.log('The current browser does not support all of the features required to enable persistence');
    }
});

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

// Track authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.uid);
        // Proceed to access Firestore data
    } else {
        // User is signed out
        console.log('User is signed out');
        // Prompt user to sign in
    }
});

export { db, auth, googleProvider, storage };
