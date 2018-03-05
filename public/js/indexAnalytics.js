'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$('.food-link').click(clicker(event));
}

function clicker(event) {
	event.preventDefault();
	
	gtag('event', 'click', {
		'event_category' : 'indexClick'
	});
}