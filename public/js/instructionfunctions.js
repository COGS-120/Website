
// JSON data
var speficRecipeData;
var recipeName;
var index = 0;
var stepInformation;
var recipeData = $.getJSON("../json/instructions.json", function (result) {
	speficRecipeData = result;
	recipeName = result[0].name;
});

// Window components
// To be removed when we move text to speech options
// Will be replaced by loading in settings from Firebase, or using defaults
var synth = window.speechSynthesis;
var inputForm = document.querySelector('form');
var voiceSelect = document.querySelector('select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var sayTimeout = null;

var voices = [];

// Window components that will remain when we move synthesizer code
var buttonPlay = document.querySelector('#button-play');
buttonPlay.addEventListener('click', function() {
	speak(stepInformation);
});
var buttonStop = document.querySelector('#button-stop');
buttonStop.addEventListener('click', function(){
	stop();
});

/**
 * function populateVoiceList
 * Populates the voice list with the device's available voices.
 * Creates options in the voice select dropdown, and adds voices
 */
function populateVoiceList() {
	// Get list of voices
	// The list of voices is browser dependent and we cannot expect
	// any single voice to exist.
	voices = synth.getVoices();
	var selectedIndex =
		voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
	voiceSelect.innerHTML = '';

	// Populate list per option
	for (i = 0; i < voices.length; i++) {
		var option = document.createElement('option');
		option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

		if (voices[i].default) {
			option.textContent += ' -- DEFAULT';
		}

		option.setAttribute('data-lang', voices[i].lang);
		option.setAttribute('data-name', voices[i].name);
		voiceSelect.appendChild(option);
	}
	voiceSelect.selectedIndex = selectedIndex;

	// tbh no idea what this does
	if (speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = populateVoiceList;
	}
}

/**
 * function speak
 * Speaks the given text in param stuffToSay with the current voice selected.
 * The speaker will stop and speak newly given data if the speaker is
 * interrupted by consectuive calls.
 * 
 * TODO: speech buffer is very small, and long directions are not played
 * entirely. We need to queue multiple statements when applicable.
 * Solution will be based on 
 * https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts
 * 
 * @param {*} stuffToSay - string of what to say
 */
function speak(stuffToSay) {
	// on a conflicting speak, we need to cancel the currently playing speech
	if (speechSynthesis.speaking) {
		// SpeechSyn is currently speaking, cancel the current utterance(s)
		speechSynthesis.cancel();

		// Make sure we don't create more than one timeout
		if (sayTimeout !== null) {
			clearTimeout(sayTimeout);
		}

		// This timeout is necessary because speechSynthesis does not like
		// a speak immediatley after a cancel invocation.
		sayTimeout = setTimeout(function () { speak(stuffToSay) }, 250);
	}
	else {
		// Only say things on a valid, nonempty string
		if (stuffToSay !== '') {
			var utterThis = new SpeechSynthesisUtterance(stuffToSay);
			utterThis.onend = function (event) {
				console.log('SpeechSynthesisUtterance.onend');
			}
			utterThis.onerror = function (event) {
				console.error('SpeechSynthesisUtterance.onerror');
			}

			// Find voice to use
			var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
			for (i = 0; i < voices.length; i++) {
				if (voices[i].name === selectedOption) {
					utterThis.voice = voices[i];
				}
			}

			// Set voice parameters
			utterThis.pitch = pitch.value;
			utterThis.rate = rate.value;
			
			// Finally, say the phrase
			synth.speak(utterThis);
		}
	}
}

function pause() {
	if (speechSynthesis.speaking) {
		speechSynthesis.pause();
	}
}

function stop() {
	if (speechSynthesis.speaking) {
		speechSynthesis.cancel();
	}
}

pitch.onchange = function () {
	pitchValue.textContent = pitch.value;
}

rate.onchange = function () {
	rateValue.textContent = rate.value;
}

voiceSelect.onchange = function () {
	speak(stepInformation);
}

// Here is your stuff Kenneth

window.onload = function () {
	populateVoiceList();
	display();
}

document.onload = function () {
	populateVoiceList();
	display();
}

function nextIndex() {
	if (speficRecipeData[0].steplist[index].hasOwnProperty("end")) {
		window.location.href = "/../finish/" + recipeName;
	}
	else {
		index++;
		display();
	}
}

function previousIndex() {
	index--;
	if (index < 0) {
		index = 0;
	}
	display();
}

function display() {
	var title = document.getElementById("stepTitle");
	// Store this in a variable so we can use it in the document
	stepInformation = speficRecipeData[0].steplist[index].step;
	title.innerText = stepInformation;

	speak(stepInformation);
}