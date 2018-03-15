/**
 * share.js
 * 
 * Provides functionality for the share page.
 * PRECONDITION: Firebase is connected with /js/firebaseCheck.js
 */

'use strict';

const supported = 'mediaDevices' in navigator;

function initializePage() {
    $('.home-button').click(clicker(event));
}

function clicker(event) {
    event.preventDefault();
    
    gtag('event', 'click', {
        'event_category' : 'backToHomeClicked'
    });
}


/** 
 * function take_picture
 * 
 * Provides direct access to the camera.
 * To later be implemented, because interactive camera would be cool.
 */
function take_picture() {
    console.log("take_picture called");

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
            width: { min: 1280 },
            height: { min: 720 }
        }
    }).then(function (mediaStream) {
        var video = document.getElementById('image-preview');
        video.srcObject = mediaStream;
        video.onloadedmetadata = function (e) {
            video.play();
        };
    }).catch(function (err) {
        console.log(err);
    });
}

$("#imgInp").change(function () {
    readURL(this);
    console.log("called this in share");
});

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#image-preview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}
