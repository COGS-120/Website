
// JSON data
var what;
var name;
var index = 0;
var recipeData = $.getJSON("../json/instructions.json", function (result) {
	what = result;
	name = result[0].name;
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

/**
 * function populateVoiceList
 * Populates the voice list with the device's available voices.
 * Creates options in the voice select dropdown, and adds voices
 */
function populateVoiceList() {
	voices = synth.getVoices();
	var selectedIndex =
		voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
	voiceSelect.innerHTML = '';
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
 * @param {*} stuffToSay - string of what to say
 */
function speak(stuffToSay) {
	if (speechSynthesis.speaking) {
		// SpeechSyn is currently speaking, cancel the current utterance(s)
		speechSynthesis.cancel();

		// Make sure we don't create more than one timeout...
		if (sayTimeout !== null) {
			clearTimeout(sayTimeout);
		}

		sayTimeout = setTimeout(function () { speak(stuffToSay) }, 250);
	}
	else {
		if (stuffToSay !== '') {
			var utterThis = new SpeechSynthesisUtterance(stuffToSay);
			utterThis.onend = function (event) {
				console.log('SpeechSynthesisUtterance.onend');
			}
			utterThis.onerror = function (event) {
				console.error('SpeechSynthesisUtterance.onerror');
			}
			var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
			for (i = 0; i < voices.length; i++) {
				if (voices[i].name === selectedOption) {
					utterThis.voice = voices[i];
				}
			}
			utterThis.pitch = pitch.value;
			utterThis.rate = rate.value;
			synth.speak(utterThis);
		}
	}
}

pitch.onchange = function () {
	pitchValue.textContent = pitch.value;
}

rate.onchange = function () {
	rateValue.textContent = rate.value;
}

voiceSelect.onchange = function () {
}

// Here is your shit Kenneth

window.onload = function () {
	populateVoiceList();
	display();
}

document.onload = function () {
	populateVoiceList();
	display();
}

function nextIndex() {
	if (what[0].steplist[index].hasOwnProperty("end")) {
		window.location.href = "/../finish/" + name;
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
	title.innerText = what[0].steplist[index].step;

	speak(what[0].steplist[index].step);
}