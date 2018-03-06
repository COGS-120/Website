
// JSON data
var speficRecipeData;
var recipeName;
var index = -1;
var stepInformation;
var extra_features_options = document.getElementById('extra-features-options');
var title = document.getElementById("stepTitle");
var dishName;
var indexOfDish;

// Window components
var synth = window.speechSynthesis;
var inputForm = document.querySelector('form');
var voiceSelect = document.querySelector('select');
var sayTimeout = null;
var voices = [];

var tts_feedback = document.querySelector('#tts-heard');
var annyangTimeout = null;

// Options to use the cool features
var use_tts = true;
var use_sr = true;
var checkbox_tts = document.getElementById('activate-text-to-speech');
checkbox_tts.addEventListener('change', function () {
	use_tts = this.checked;
	if (this.checked) {
		speak(stepInformation);
	}
	else {
		stop();
	}
});
var checkbox_sr = document.getElementById('activate-speech-recognition');
checkbox_sr.addEventListener('change', function () {
	use_sr = this.checked;
	if (this.checked) {
		restartAnnyang();
	}
	else {
		tts_feedback.innerText = "";
	}
});


// Window components that will remain when we move synthesizer code
var buttonPlay = document.querySelector('#button-play');
buttonPlay.addEventListener('click', function () {
	speak(stepInformation);
});
var buttonStop = document.querySelector('#button-stop');
buttonStop.addEventListener('click', function () {
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
		sayTimeout = setTimeout(function () { speak(stuffToSay) }, 500);
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
			utterThis.pitch = 1;
			utterThis.rate = 0.8;

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

voiceSelect.onchange = function () {
	speak(stepInformation);
}

// Here is your stuff Kenneth

// We need to add events to the window loader differently because we have
// multiple on load functions

/**
 * Function called in extractRecipe
 */
function open() {

	// Index should start at -1
	index = -1;

	$.getJSON("../json/instructions.json", function (result) {
		speficRecipeData = result;
		indexOfDish = 0;

		for (var i = 0; i < result.length; i++) {
			if (result[i].name == dishName) {
				indexOfDish = i;
			}
		}

		recipeName = result[indexOfDish].name;
		populateVoiceList();
		display("beginning");
	});

	// Speech to text
	if (annyang) {

		// Commands
		// The first word of the uterrance will determine the function.
		// We wildcard anything after so that commands can continue
		var commands = {
			'next *blep': function () {
				nextIndex();
			},
			'back *blep': function () {
				previousIndex();
			},
			'pause *blep': function () {
				stop();
			},
			'stop *blep': function () {
				stop();
			},
			'repeat *blep': function () {
				speak(stepInformation);
			},
			'restart *blep': function () {
				speak(stepInformation);
			}

		};


		// Add our commands to annyang
		annyang.addCommands(commands);

		// add event callbacks. code is very self explanatory
		annyang.addCallback('resultMatch', function (userSaid, commandText, phrases) {
			tts_feedback.innerText = userSaid;
		});

		annyang.addCallback('error', function () {
			tts_feedback.innerText = 'Unknown error';
		});

		annyang.addCallback('errorNetwork', function () {
			tts_feedback.innerText = "Annyang network error: cannot reach speech to text service.";
		})

		annyang.addCallback('errorPermissionBlocked', function () {
			tts_feedback.innerText = 'Permission to use the microphone was blocked by the browser.';
		});

		annyang.addCallback('errorPermissionDenied', function () {
			tts_feedback.innerText = 'Permission was denied to use the microphone by the user.';
		});

		annyang.addCallback('result', function (userSaid) {
			tts_feedback.innerText = userSaid[0];
		});

		annyang.addCallback('soundstart', function () {
			tts_feedback.innerText = 'Listening...';
		});

		annyang.addCallback('end', function () {
			console.log("annyang ended, restarting...");
			restartAnnyang(); // workaround call
		})

		// Start listening.
		restartAnnyang();
	}
	else {
		console.log("Annyang speech to text not supported.");
	}

}

/** 
 * Currently a workaround for the Chrome bug detailed in 
 * https://bugs.chromium.org/p/chromium/issues/detail?id=572697&thanks=572697&ts=1451323087
 */
function restartAnnyang() {

	if (use_sr == false) {
		return;
	}

	// Make sure we don't create more than one timeout
	if (annyangTimeout !== null) {
		clearTimeout(annyangTimeout);
	}

	annyangTimeout = setTimeout(function () {
		annyang.start({ autoRestart: false, continuous: false })
	}, 500);
}

function nextIndex() {
	if (index > 0 && speficRecipeData[indexOfDish].steplist[index - 1].hasOwnProperty("end")) {
		window.location.href = "/../share/" + recipeName;
	}
	else if (index > 0 && speficRecipeData[indexOfDish].steplist[index].hasOwnProperty("end")) {
		index++;
		display("end");
	}
	else {
		// Make sure names are not end-names
		index++;
		display("step");
	}
}

function previousIndex() {
	index--;
	if (index < -1) {
		window.location.href = "/../ingTool/" + recipeName;
	}
	else if (index == -1) {
		display("beginning")
	}
	else {
		display("step");
	}
}


function extractRecipe(tempName) {
	dishName = tempName;

	open();

	console.log("Extract Recipe " + tempName);
	// dishName is a string of the food a user wants to cook
}

function display(type) {

	console.log(type + " " + index);

	// Make sure to show the options for 
	if (type === "beginning") {
		extra_features_options.style.display = "block";
		stepInformation = title.innerText;
		title.innerText = "Synthesizer and voice command options";
	}
	else if (type === "step"){
		extra_features_options.style.display = "none";
		stepInformation = speficRecipeData[indexOfDish].steplist[index].step;
		title.innerText = stepInformation;
	}
	else if (type === "end") {
		extra_features_options.style.display = "none";
		stepInformation = "Congratulations! You have finished cooking " + dishName + ". Continue to share your creation!";
		title.innerText = stepInformation;
	}
	else {
		console.log("Invalid type: " + type);
	}

	// Speak on next one, if user wants
	if (use_tts) {
		speak(stepInformation);
	}

}
