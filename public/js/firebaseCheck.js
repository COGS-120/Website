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
var database;
var storage;
var storageRef;
var pageType;
var pageVar1;

var pictureToShare;

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
    database = firebase.database();
    storage = firebase.storage();
    storageRef = firebase.storage().ref();
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

/** 
 * Signs outs 
 */
FirebaseWorker.prototype.signOut = function () {
    this.auth.signOut();
};

/**
 * Triggers when the auth state change for instance when the user signs-out.
 */
FirebaseWorker.prototype.onAuthStateChanged = function (user) {
    if (user) { // User is signed in!
        console.log("User has been logged in.");
        var localThis = this;

        // Every page will have the navbar. Every page must load this before
        // making other changes.
        $("#topNavBar").load('/html/navbar.html', function () {
            $('#dummyBar').remove();

            // After everything has been properly initialized, we can access information
            // freely.
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var photoUrl = user.photoURL;
            currentUser = firebase.auth().currentUser;

            var userName = document.getElementById('profileName');
            var profileCircle = document.getElementById('profileCircle');

            // Behavior changes depending on anonymity of user
            if (currentUser.isAnonymous) {
                userName.innerText = "Anonymous User";
                profileCircle.src = "/images/anonymous.png";
            }
            else {
                userName.innerText = currentUser.displayName;
                profileCircle.src = user.photoURL;
            }
            var buttonLogout = document.getElementById('buttonLogout');
            buttonLogout.addEventListener('click', localThis.signOut.bind(localThis));

            // Record last activity
            var currentDate = new Date();
            writeUserData("last-activity", currentDate.getTime());
        });

    }

    else { // User is signed out!
        console.log("User has been signed out.");
        window.location.href = "/login";
    }
};

/** 
 * Checker function
 * Checks whether setup has been completed.
 * If you are getting this error, be sure that your html or handlebars file 
 * contains the script includes at the top file comment.
 * If all that has been done, and you're still getting this, contact Chris
 */
FirebaseWorker.prototype.checkSetup = function () {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ');
    }
};

$(document).ready(startNetworking);

/** 
 * function startNetworking
 * 
 * Starts the networking
 */
function startNetworking() {
    window.firebaseWorker = new FirebaseWorker();
}

/**
 * function wrtieUserData
 * 
 * Sets the user data at the specified key.
 * Will always overwrite.
 * @param {*} key 
 * @param {*} val 
 */
function writeUserData(key, val) {
    database.ref(userPath() + key).set(val);

    console.log("Wrote " + val + " to database at " + userPath() + key);
}

/**
 * Checks if the given food name is the favorite
 * 
 * PREDONDITION: pageType == "Food" 
 * PRECONDITION: currentUser is defined
 * @param {string} foodName 
 */
function checkIfFavorite(foodName, toggle) {
    addKeyIfNonexistent("favorites");

    // Get data from database
    var favorites = database.ref(userPath() + "favorites").once("value", function (snapshot) {
        var favoriteList = snapshot.val();
        var isAFavorite = false;
        var containingKey;

        $.each(favoriteList, function (key, value) {
            if (value === foodName) {
                isAFavorite = true;
                containingKey = key;
            }
        });

        // Change value if we want to toggle. Also change star
        if (toggle === true) {
            if (isAFavorite === true) {
                // Remove from database
                database.ref(userPath() + "favorites").child(containingKey).remove();
                $('#favorites-star').attr("src", "../images/favorites/star_unchecked.svg");
                $('#favorites-message').html("Removed from favorites");
            }
            else {
                // Add to database
                database.ref(userPath() + "favorites").push(foodName);
                $('#favorites-star').attr("src", "../images/favorites/star_checked.svg");
                $('#favorites-message').html("Added to favorites");
            }
        }
        else {
            // change image based on favorites setting
            if (isAFavorite === true) {
                $('#favorites-star').attr("src", "../images/favorites/star_checked.svg");
            }
            else {
                $('#favorites-star').attr("src", "../images/favorites/star_unchecked.svg");
            }
        }

    });
}

/** 
 * Enumerates all the favorites in the favorites page
 * 
 * PREDONDITION: pageType == "Favorites" 
 * PRECONDITION: currentUser is defined
 */
function enumerateFavorites() {
    addKeyIfNonexistent("favorites");

    // Get data from JSON
    var foodJsonData;
    $.getJSON("../json/food.json", function (result) {
        foodJsonData = result;
    });

    // Get data from database
    var favorites = database.ref(userPath() + "favorites").once("value", function (snapshot) {
        var favoriteList = snapshot.val();

        var counter = 0; // Counter needed here because firebase has no counter
        $.each(favoriteList, function (key, value) {

            if (value != 'none') {
                counter += 1;

                var imageString;
                var timeString;
                // Find the image data
                $.each(foodJsonData, function (key, category) {
                    $.each(category, function (key, foodval) {
                        if (foodval.name === value) {
                            imageString = foodval.image;
                            timeString = foodval.time;
                        }
                    });
                });

                // for each favorite, add in the relevant div
                var stringToAdd = "";

                // string building pattern
                stringToAdd += '<div class="col-8">';
                stringToAdd += '<a href="../food/' + value + '">';
                stringToAdd += '<img class="food-card-img" src="../images/' + imageString + '" alt="Card image">';
                stringToAdd += '</a>';
                stringToAdd += '</div>';
                stringToAdd += '<div class="col-4 col-info">';
                stringToAdd += '<a class="food-link" href="../food/' + value + '">';
                stringToAdd += '<h5 class="inner-name">';
                stringToAdd += value;
                stringToAdd += '</h5>';
                stringToAdd += '<p>' + timeString + '</p>';
                stringToAdd += '</a>';
                stringToAdd += '</div>';
                document.getElementById('food-row').innerHTML += stringToAdd;
            }

        });

        // Case where counter is 0. Show the 'no favorites' essage
        if (counter === 0) {
            document.getElementById("no-favorites-message").style.display = "block";
        }
        else {
            document.getElementById("no-favorites-message").style.display = "none";
        }
    });
}

/** 
 * Code for share function.
 * Storage is on Firebase.
 */
function share(foodType) {
    console.log("Called");

    addKeyIfNonexistent("foodPics/" + foodType);

    var placeRef = storageRef.child("foodPics/" + foodType + "/" + currentUser.displayName);

    if (pictureToShare != null) {
        placeRef.put(pictureToShare).then(function (snapshot) {
            console.log("Successfuly put file in.");
            $('#share-status').text("File has been shared.");
            $('#share-status').show();
        });
    }
    else {
        $('#share-status').text("You haven't added a file to share yet!");
        $('#share-status').show();
    }
}

/** 
 * Returns the user path in the database. 
 */
function userPath() {
    return "users/" + currentUser.uid + "/";
}

$("#imgInp").change(function () {
    pictureToShare = this.files[0];
});

function addKeyIfNonexistent(key) {
    var usersRef = database.ref(userPath());
    usersRef.child(key).once('value', function (snapshot) {
        var exists = (snapshot.val() !== null);
        if (exists === false) {
            setBlankValue(key);
        }
    });
}

function setBlankValue(key) {
    database.ref(userPath() + key).set({ "iii": "none" });
}

function addStorageIfNonexistent(key) {
    storageRef.child(key).getDownloadUrl().then(function (foundURL) {
        console.log("found: " + foundURL);
    },
        function (error) {
            console.log("not found. creating.");
        });
}

/**
 * Sets the page type.
 * Depending on the page type, this script will activate different behaviors
 * 
 * @param {*} type 
 * @param {*} var1 
 */
function setPageType(type, var1) {
    pageType = type;
    pageVar1 = var1;

    // Any functions here must be called when the current user has been
    // initialized and logged in.
    if (currentUser) {
        if (pageType == "Food") { // double equals is intentional here, don't ===
            checkIfFavorite(pageVar1, false);
        }

        else if (pageType == "Favorites") {
            enumerateFavorites();
        }

        else if (pageType == "Share") {
            //share(pageVar1);
        }
    }

    // If no user has been logged in, delay and try again.
    else {
        setTimeout(function () { setPageType(type, var1) }, 100);
    }

}