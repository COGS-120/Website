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
var storageRef;

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
}

/**
 * Initializes Firebase and other required scripts
 */
FirebaseWorker.prototype.initFirebase = function () {
    this.auth = firebase.auth();
    database = firebase.database();
    storageRef = firebase.storage().ref();
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
    addUserKeyIfNonexistent("favorites");

    // Get data from database
    database.ref(userPath() + "favorites").once("value", function (snapshot) {
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
    addUserKeyIfNonexistent("favorites");

    // Get data from JSON
    $.getJSON("../json/food.json", function (result) {
        // Get data from database
        database.ref(userPath() + "favorites").once("value", function (snapshot) {
            var favoriteList = snapshot.val();

            var counter = 0; // Counter needed here because firebase has no counter
            $.each(favoriteList, function (key, value) {

                if (value != 'none') {
                    counter += 1;

                    var imageString;
                    var timeString;
                    // Find the image data
                    $.each(result, function (key, category) {
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
    });
}

function enumerateFoodGallery(food) {
    /* Get the storage location */
    var storageLocation = storageRef.child("foodPics/" + food);

    /* Get the reference from the database */
    database.ref("food/" + food + "/pictures/").once('value').then(function (snapshot) {
        if (snapshot.val() != null) {
            $.each(snapshot.val(), function (key, value) {

                // Create a URL reference for each photo that exists in the storage location.
                storageLocation.child(value).getDownloadURL().then(function (url) {
                    storageLocation.child(value).getMetadata().then(function (metadata) {
                        // Create a div and add this as a picture
                        // for each favorite, add in the relevant div
                        var strAdd = "";
                        var name = metadata.customMetadata.name;
                        var date = metadata.customMetadata.date;
                        var description = metadata.customMetadata.description;

                        // string building pattern
                        strAdd += '<div class="col-8 auto">';
                        strAdd += '<h5 class="text-left px-2 px-md-0">' + name + '</h5>';
                        strAdd += '</div>';
                        strAdd += '<div class="col-4 auto">';
                        strAdd += '<p class="text-right px-2 px-md-0">' + date + '</p>';
                        strAdd += '</div>';
                        strAdd += '<div class="col-12 food-card">';
                        strAdd += '<img class="img-fluid food-img" src="' + url + '">';
                        strAdd += '<div class="px-2 px-md-0 food-desc">' + description + '</div>';
                        strAdd += '<hr>';
                        strAdd += '</div>';
                        document.getElementById('food-row').innerHTML += strAdd;
                    });
                });
            });
        }
        else {
            document.getElementById('food-no-content').innerHTML +=
                "<div>No one has uploaded photos for " + food + " yet.</div>";
        }
    });

}

function enumerateProfile() {
    console.log(currentUser.displayName);
    document.getElementById("profileUserName").innerHTML = currentUser.displayName;
    document.getElementById("profileEmail").innerHTML = currentUser.email;
    document.getElementById("profileImage").src = currentUser.photoURL;

    // Show amount of favorites
    database.ref(userPath() + "favorites").once("value", function (snapshot) {
        document.getElementById("favorites-amount").innerHTML = snapshot.numChildren();
    });

    // Enumerate food pictures
    database.ref(userPath()).child("pictures/").once('value').then(function (snapshot) {
        if (snapshot.val() != null) {

            // Set amount of photos
            document.getElementById("gallery-amount").innerHTML = snapshot.numChildren();

            // Loop through and add a picture
            $.each(snapshot.val(), function (key, value) {

                var location = value.substring(0, value.indexOf("<>"));

                var storageLocation = storageRef.child("foodPics/" + location);

                // Create a URL reference for each photo that exists in the storage location.
                storageLocation.child(value).getDownloadURL().then(function (url) {
                    storageLocation.child(value).getMetadata().then(function (metadata) {
                        // Create a div and add this as a picture
                        // for each favorite, add in the relevant div
                        var strAdd = "";
                        var name = metadata.customMetadata.name;
                        var date = metadata.customMetadata.date;
                        var description = metadata.customMetadata.description;

                        // string building pattern
                        strAdd += '<div class="col-8 auto">';
                        strAdd += '<h5 class="text-left px-2 px-md-0"></h5>';
                        strAdd += '</div>';
                        strAdd += '<div class="col-4 auto">';
                        strAdd += '<p class="text-right px-2 px-md-0">' + date + '</p>';
                        strAdd += '</div>';
                        strAdd += '<div class="col-12 food-card">';
                        strAdd += '<img class="img-fluid food-img" src="' + url + '">';
                        strAdd += '<div class="px-2 px-md-0 food-desc">' + description + '</div>';
                        strAdd += '<hr>';
                        strAdd += '</div>';
                        document.getElementById('food-pictures').innerHTML += strAdd;
                    });
                });
            });
        }
        else {
            document.getElementById('food-no-content').innerHTML +=
                "<div>No one has uploaded photos for " + food + " yet.</div>";
        }
    });
}

/** 
 * Code for share function.
 * Storage is on Firebase.
 */
function share(foodType) {
    console.log("Called");

    /* Create items */
    var itemName = foodType + "<> " + Date.now();

    var storagePlaceRef = storageRef.child(
        "foodPics/" + foodType + "/" + itemName);
    var databasePlaceRef = database.ref("food/" + foodType + "/pictures/");
    var userDatabasePlaceRef = database.ref(userPath()).child("pictures/");

    // Add metadata for this object
    var d = new Date();
    var newDescription = document.getElementById("descriptionArea").value;
    if (newDescription == "") {
        newDescription = "No description provided.";
    }

    var newMetadata = {
        customMetadata: {
            name: currentUser.displayName,
            date: d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate(),
            description: newDescription,
            food: foodType
        }
    }

    // If a picture has been enumerated, then allow user to share.
    if (pictureToShare != null) {
        storagePlaceRef.put(pictureToShare).then(function (snapshot) {
            console.log("Successfuly put file in.");
            $('#share-status').text("File has been shared.");
            $('#share-status').show();
            storagePlaceRef.updateMetadata(newMetadata).then(function (metadata) {
                console.log("Updated Metadata");
            });

            databasePlaceRef.push(itemName);
            userDatabasePlaceRef.push(itemName);

            // Make stuff move away
            document.getElementById("shareRow").style.display = "none";
            document.getElementById("rateRow").style.display = "flex";
        });

    }
    else {
        $('#share-status').text("You haven't added a file to share yet!");
        $('#share-status').show();
    }
}

function rate(foodType, verdict) {
    console.log(foodType + " " + verdict);

    // Add rating to user ratings
    var userPlaceRef = database.ref(userPath()).child("ratings/");
    userPlaceRef.child(foodType).set(verdict);

    // Add to food ratings
    var foodPlaceRef = database.ref("food/" + foodType + "/ratings/");
    foodPlaceRef.child(verdict).once('value', function (snapshot) {
        if (snapshot == null) {
            foodPlaceRef.child(verdict).set(1);
        }
        else {
            foodPlaceRef.child(verdict).set(snapshot.val() + 1);
        }

        // After both of these (still not guaranteed, be done)
        document.getElementById("doneMessage").innerText = "Thanks for rating!";

        // Send home after a delay
        setTimeout(function () { home() }, 1000);
    });

}

function home() {
    window.location.href = "/";
}

/** 
 * Returns the user path in the database. 
 */
function userPath() {
    return "users/" + currentUser.uid + "/";
}

/**
 * Adds a listener to check for a different file that is to be shared.
 */
$("#imgInp").change(function () {
    pictureToShare = this.files[0];
});

function addUserKeyIfNonexistent(key) {
    database.ref(userPath()).child(key).once('value', function (snapshot) {
        var exists = (snapshot.val() !== null);
        if (exists === false) {
            setBlankValue(key);
        }
    });
}

function setBlankValue(key) {
    database.ref(userPath() + key).set({ "iii": "none" });
}

/**
 * Sets the page type.
 * Depending on the page type, this script will activate different behaviors
 * 
 * @param {*} type 
 * @param {*} var1 
 */
function setPageType(type, var1) {

    // Any functions here must be called when the current user has been
    // initialized and logged in.
    if (currentUser) {
        if (type == "Food") { // double equals is intentional here, don't ===
            checkIfFavorite(var1, false);
        }

        else if (type == "Favorites") {
            enumerateFavorites();
        }

        else if (type == "Share") {
            //share(pageVar1);
        }

        else if (type == "Food Gallery") {
            enumerateFoodGallery(var1);
        }

        else if (type == "Profile") {
            enumerateProfile();
        }
    }

    // If no user has been logged in, delay and try again.
    else {
        setTimeout(function () { setPageType(type, var1) }, 100);
    }

}