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

// ---------------- Register New Uswer --------------------------------//

document.getElementById('submitData').onclick = function() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('userEmail').value;

  // Firebase will require a password of at least 6 characters
  const password = document.getElementById('userPass').value;

  // Validate User Inputs
  if (!validation(firstName, lastName, email, password)) {
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      
      // Add user account info to realtime database
      // 'Set' will create a new reference or completely replace an existing one
      // Each new user will be placed under the 'users' node
      set(ref(db, 'users/' + user.uid + '/accountInfo'), {
        uid: user.uid,
        email: email,
        password: encryptPass(password),
        firstname: firstName,
        lastname: lastName
      })
      .then(() => {
        alert('User created successfully') 
      })
      .catch((error) => {
        alert(error)
      })
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      // ..
    });

  }


// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
function validation(firstName, lastName, email, password) {
  let fNameRegex = /^[a-zA-Z]+$/;
  let lNameRegex = /^[a-zA-Z]+$/;
  let emailRegex = /^[a-zA-z0-9]+@ctemc\.org$/;

  if (isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) 
    || isEmptyorSpaces(email) || isEmptyorSpaces(password)) {
      alert("Please complete all fields.");
      return false;
  }

  if (!fNameRegex.test(firstName)) {
    alert("The first name should only contain letters.")
    return false;
  }
  if (!lNameRegex.test(lastName)) {
    alert("The last name should only contain letters.")
    return false;
  }
  if (!emailRegex.test(email)) {
    alert("The email should be valid.")
    return false;
  }
  return true;
}

// --------------- Password Encryption -------------------------------------//
function encryptPass(password) {
  let encrypted = CryptoJS.AES.encrypt(password, password)
  return encrypted.toString();
}

function decryptPass(password) {
  let decrypted = CryptoJS.AES.encrypt(password, password)
  return decrypted.toString();
}