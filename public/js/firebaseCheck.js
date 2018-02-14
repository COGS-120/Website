/**
 * firebaseCheck.js
 * 
 * This file should be placed on every page except for the login page.
 * This checks for any form of Firebase authentication supported.
 * If Firebase is not authenticated, then the user should be directed to login.
 * 
 * This file is intended to provide an easy-to-use interface for us to send and
 * receive data from the Firebase realtime database, Firebase storage, and also
 * to manage login/logout status.
 * 
 * For the page to support this file, there needs to be the required Firebase 
 * scripts included in the handlebars file. The full include is:  

  <script src="https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/4.9.1/firebase-database.js"></script>
  <script src="https://www.gstatic.com/firebasejs/4.9.1/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/4.9.1/firebase.js"></script>
  <script src="/js/firebaseCheck.js"></script>

 * This script depends on the login button, which is in the top navbar.
 * Be sure to include this script after including the navbar loader.
 * 
 * Currently supported login methods
 * - Google
 * - Anonymous
 * Login methods we wish to implement
 * - Facebook
 * - Email
 */

'use strict';

var currentUser;

/** 
 * Configuration variables
 * This, and the call to initialize Firebase must be first
 */
var config = {
    apiKey: "AIzaSyARfyMjd4yj6KkscpvHu2i0Xgw0xKcn7G8",
    authDomain: "ez-cooking-21ebe.firebaseapp.com",
    databaseURL: "https://ez-cooking-21ebe.firebaseio.com",
    projectId: "ez-cooking-21ebe",
    storageBucket: "ez-cooking-21ebe.appspot.com",
    messagingSenderId: "796679434279"
};
firebase.initializeApp(config);

/** 
 * function FirebaseWorker
 * 
 * Initializes the Firebase Worker, and makes any necessary modifications to
 * the page.
 */
function FirebaseWorker() {
    this.checkSetup();

    this.initFirebase();
    console.log("Initialized Firebase Worker");


}

/**
 * Initializes Firebase and other required scripts
 */
FirebaseWorker.prototype.initFirebase = function () {
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();

    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

FirebaseWorker.prototype.signOut = function () {
    this.auth.signOut();
};

/**
 * Triggers when the auth state change for instance when the user signs-out.
 */
FirebaseWorker.prototype.onAuthStateChanged = function (user) {
    if (user) { // User is signed in!
        console.log("User has been logged in.");
        // After everything has been properly initialized, we can access information
        // freely.
        currentUser = firebase.auth().currentUser;

        this.userName = document.getElementById('profileName');
        this.userName.innerText = "Profile - " + currentUser.displayName;

        this.buttonLogout = document.getElementById('buttonLogout');
        this.buttonLogout.addEventListener('click', this.signOut.bind(this));
    }

    else { // User is signed out!
        window.location.href = "/login";
    }
};

/** 
 * Checker function
 */
FirebaseWorker.prototype.checkSetup = function () {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions and make ' +
            'sure you are running the codelab using `firebase serve`');
    }
};

window.onload = function () {
    window.firebaseWorker = new FirebaseWorker();
};
