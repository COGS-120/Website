/**
 * firebaseLogin.js
 * 
 * This file should only be placed at the login, and handles a state of not
 * being logged into the system. 
 * 
 * For the page to support this file, there needs to be the required Firebase 
 * scripts included in the handlebars file. The full include is:  

  <script src="https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/4.9.1/firebase-database.js"></script>
  <script src="https://www.gstatic.com/firebasejs/4.9.1/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/4.9.1/firebase.js"></script>
  <script src="/js/firebaseCheck.js"></script>
 
 */


'use strict';

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
 * function FirebaseLoginWorker
 * 
 * Initializes the Firebase Login Worker.
 * Makes modifications to the page necessary for login to exist
 */
function FirebaseLoginWorker() {
    this.checkSetup();

    this.signInButtonGoogle = document.getElementById("sign-in-google");
    this.signInButtonGuest = document.getElementById("sign-in-guest");

    this.statusText = document.getElementById("login-status");

    this.userName = document.getElementById('user-name');

    // Bind buttons
    this.signInButtonGoogle.addEventListener('click', this.signInGoogle.bind(this));
    this.signInButtonGuest.addEventListener('click', this.signInGuest.bind(this));

    this.initFirebase();
    console.log("Initialized Firebase");
}

/*
 * Initializes Firebase
 */
FirebaseLoginWorker.prototype.initFirebase = function () {
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();

    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

/** 
 * Login provider for Google authentication.
 * After successful login, the function onAuthStateChanged will be called and 
 * the user will be redirected to the home page.
 * This is true for the other login methods.
 */
FirebaseLoginWorker.prototype.signInGoogle = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

/** 
 * Login provider for Facebook Authentication
 * 
 * TODO: handle case where we want only one account per person.
 */
FirebaseLoginWorker.prototype.signInFacebook = function () {
    var provider = new firebase.auth.FacebookAuthProvider();
    //provider.addScope('user_birthday');
    //firebase.auth().useDeviceLanguage();

    // Authenticate
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var facebookAccessToken = result.credential.accessToken;

    }).catch(function (error) {
        // Handle Errors here
        console.log("Failed to log in with Facebook. Error code " + error.code);
        console.log(error.message);
    });
}

/** 
 * Login provider for guest account. 
 */
FirebaseLoginWorker.prototype.signInGuest = function () {
    firebase.auth().signInAnonymously().catch(function (error) {
        // Handle Errors here
        console.log("Failed to log in anonymously. Error code " + error.code);
        console.log(error.message);
    });
}

/** 
 * Sign out/log out feature
 * Not sure if this will be used
 */
FirebaseLoginWorker.prototype.signOut = function () {
    this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
FirebaseLoginWorker.prototype.onAuthStateChanged = function (user) {
    if (user) { // User is signed in
        this.statusText.innerText = "LOGGED IN";

        var isAnonymous = user.isAnonymous;
        var uid = user.uid;

        // Redirect to home page
        window.location.href = "/";

        /*
        // Hide sign-in button.
        this.signInButton.setAttribute('hidden', 'true');

        // We load currently existing chant messages.
        this.loadMessages();

        // We save the Firebase Messaging Device token and enable notifications.
        this.saveMessagingDeviceToken();
        */
    }

    else { // User is signed out
        // Nothing should happen
    }
};

/** 
 * Checker function
 * Checks whether setup has been completed.
 * If you are getting this error, be sure that your html or handlebars file 
 * contains the script includes at the top file comment.
 * If all that has been done, and you're still getting this, contact Chris
 */
FirebaseLoginWorker.prototype.checkSetup = function () {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions and make ' +
            'sure you are running the codelab using `firebase serve`');
    }
};

/** 
 * function startNetworking
 * 
 * Starts the networking.
 * Must be called when document is ready
 */
function startNetworking() {
    window.FirebaseLoginWorker = new FirebaseLoginWorker();
}


$(document).ready(startNetworking);