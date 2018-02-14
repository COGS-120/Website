
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

function FirebaseWorker() {
    this.checkSetup();

    this.signInButtonGoogle = document.getElementById("sign-in-google");
    this.signOutButton = document.getElementById("sign-out");
    this.statusText = document.getElementById("login-status");
    
    this.userName = document.getElementById('user-name');

    // Bind buttons
    this.signInButtonGoogle.addEventListener('click', this.signInGoogle.bind(this));

    this.initFirebase();
    console.log("Initialized Firebase");
}

/*
 * Initializes Firebase
 */
FirebaseWorker.prototype.initFirebase = function () {
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();

    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

FirebaseWorker.prototype.signInGoogle = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

FirebaseWorker.prototype.signOut = function () {
    this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
FirebaseWorker.prototype.onAuthStateChanged = function (user) {
    if (user) { // User is signed in!
        this.statusText.innerText = "LOGGED IN";

        window.location.href = "/";
        // Get profile pic and user's name from the Firebase user object.
        var profilePicUrl = user.photoURL;
        var userName = user.displayName;

        /*
        // Set the user's profile pic and name.
        this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
        this.userName.textContent = userName;

        // Show user's profile and sign-out button.
        this.userName.removeAttribute('hidden');
        this.userPic.removeAttribute('hidden');
        this.signOutButton.removeAttribute('hidden');

        // Hide sign-in button.
        this.signInButton.setAttribute('hidden', 'true');

        // We load currently existing chant messages.
        this.loadMessages();

        // We save the Firebase Messaging Device token and enable notifications.
        this.saveMessagingDeviceToken();
        */
    } 
    
    else { // User is signed out!
        //TODO: add logout button
        /*
        // Hide user's profile and sign-out button.
        this.userName.setAttribute('hidden', 'true');
        this.userPic.setAttribute('hidden', 'true');
        this.signOutButton.setAttribute('hidden', 'true');

        // Show sign-in button.
        this.signInButton.removeAttribute('hidden');
        */
    }
};

// Checks that the Firebase SDK has been correctly setup and configured.
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
