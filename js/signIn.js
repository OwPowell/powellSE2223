// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import { getDatabase, ref, set, update, child, get } 
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-XQJgtBX3fFIuRa4ehhjtWng-l5Q347g",
    authDomain: "researchwebsite-e018a.firebaseapp.com",
    databaseURL: "https://researchwebsite-e018a-default-rtdb.firebaseio.com",
    projectId: "researchwebsite-e018a",
    storageBucket: "researchwebsite-e018a.appspot.com",
    messagingSenderId: "483785166790",
    appId: "1:483785166790:web:b639e008470abe2c986cc7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth();

// Return instance of the app's FRD
const db = getDatabase(app);

// ---------------------- Sign-In User ---------------------------------------//
document.getElementById('signIn').onclick = function() {
    // Get user's email and password for sign in
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Attempt to sign user in
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Create a user and store the user ID
        const user = userCredential.user;

        // Log sign-in date in DB
        // update will only add the last_login and won't overwrite anything
        let logDate = new Date();
        update(ref(db, 'users/' + user.uid + '/accountInfo'), {
            last_login: logDate
        })
        .then(() => {
            // User signed in!
            alert('User signed in successfully!');

            // Get snapshot of all the user info
            // login() function and stored in session or local storage
            get(ref(db, 'users/' + user.uid + '/accountInfo')).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    logIn(snapshot.val())
                } else {
                    console.log('User does not exist.');
                }
            })
            .catch((error) => {
                console.log(error)
            })
        })
        .catch((error) => {
            // Sign-in failed
            alert(error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    });
}


// ---------------- Keep User Logged In ----------------------------------//
function logIn(user) {
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;

    // Session storage is temporary (only active while browser open)
    // Info saved as a string (must convert JS object to string)
    // Session storage will be cleared with a signOut() function in home.js
    if (!keepLoggedIn) {
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location = 'home.html'; // Browser redirect to the home page
    }

    // Local storage is permanent (unless you signOut)
    else {
        localStorage.setItem('keepLoggedIn', 'yes')
        localStorage.setItem('user', JSON.stringify(user));
        window.location = 'home.html'; // Browser redirect to the home page
    }
}
