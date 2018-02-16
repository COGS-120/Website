/**
 * share.js
 * 
 * Provides functionality for the share page.
 */

'use strict';

const supported = 'mediaDevices' in navigator;

$(document).ready(open);

function open() {


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
    }).then(function (stream) {
        /* use the stream */
        console.log("successful access of media");
    }).catch(function (err) {
        console.log(err);
    });
}

function share() {
    $('#share-status').show();
}