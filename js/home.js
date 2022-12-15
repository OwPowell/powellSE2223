// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import { getDatabase, ref, set, update, child, get, remove } 
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



// ---------------------// Get reference values -----------------------------
let signOutLink = document.getElementById('nbMenuButton'); // Signout link
let welcome = document.getElementById('welcome');      // Welcome header
let currentUser = null;                               // Initialize currentUser to null


// ----------------------- Get User's Name'Name ------------------------------
function getUsername() {
  // Grab the value for the 'keep logged in' switch
  let keepLoggedIn = localStorage.getItem('keepLoggedIn');

  // Grab user information passed from signIn.js
  if (keepLoggedIn == 'yes') {
    currentUser = JSON.parse(localStorage.getItem('user'));
  } else {
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function signOutUser() {
  sessionStorage.removeItem('user');        // Clear session storage
  localStorage.removeItem('user');          // Clear local stoage
  localStorage.removeItem('keepLoggedIn');

  signOut(auth).then(() => {
    alert("Sign out successful");
  }).catch((error) => {
    alert(error);
  });

  window.location = 'home.html'
}

// --------------------------- Home Page Loading -----------------------------
window.onload = function() {
  // ------------------------- Set Welcome Message -------------------------
  getUsername();
  if (currentUser != null) {
    welcome.innerText = 'Welcome ' + currentUser.firstname;
    document.getElementById('nbMenuButton').onclick = function() {
      signOutUser();
    }
  }

  // Update data
  document.getElementById('update').onclick = function() {
    const imageNum = document.getElementById('image-num').value;
    const trashType = document.getElementById('trash-type').value;
    const value = document.getElementById('value').value;
    const userID = currentUser.uid;

    updateData(userID, imageNum, trashType, value);
  }
}


// -------------------------Update data in database --------------------------
function updateData(userID, imageNum, trashType, value) {
  // Must use brackets around variable name to use as a key
  update(ref(db, 'users/' + userID + '/data/' + imageNum), {
    [trashType]: value
  })
  .then(() => {
    alert('Data updated successfully.');
  })
  .catch((error) => {
    alert('There was an error. Error: ' + error);
  })
}