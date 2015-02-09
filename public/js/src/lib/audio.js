'use strict';


/*
*
*	Dependencies
*
*/

import _  from 'lodash';		// browserify shim

import STATIC from 'gw2w2w-static';






/*
*	Component Globals
*/

var INSTANCE = {
	 $chimeNode: $('<audio />', {
		ref: 'chime',
		id: 'audioChime',
		src: '/audio/beep-27.mp3',
		preload: 'auto',
		volume: '0.1',
	})
};





/*
*	Component Export
*/

export default (function() {

	INSTANCE.$chimeNode.appendTo('body');

	if (isSpeechCapable()) {
		var junk = speechSynthesis.getVoices();
		//setTimeout(speak.bind(null, 'us', 'Objective tracker audio alerts are enabled.'), 1000);
	}


	return {
		$chimeNode: INSTANCE.$chimeNode,
		playAlert: playAlert,
	};
})();





/*
*	Public Methods
*/

function playAlert(audioOptions, lang, objectiveId, eventType, worldColor) {
	if (!audioOptions.enabled) return;

	console.log('audioOptions', audioOptions);

	if (isSpeechCapable()) {
		playText(lang, objectiveId, eventType, worldColor);
	}
	else {
		throttledChime();
	}
}





/*
*	Private Methods
*/

function playChime() {
	INSTANCE.$chimeNode[0].play();
}
var throttledChime = _.throttle(playChime, 1000, {trailing: false});



function playText(lang, objectiveId, eventType, worldColor) {
	var text = getTextMessage(...arguments);

	speak(lang.slug, text);
}



function getTextMessage(lang, objectiveId, eventType, worldColor) {
	var oLabel = STATIC.objective_labels[objectiveId];
	var labelText = oLabel[lang.slug];

	return (eventType === 'capture')
		? labelText + ', captured by ' + worldColor + '!'
		: labelText + ', guild claimed by ' + worldColor + '!';
}



function speak(langSlug, text) {
	var msg = new SpeechSynthesisUtterance(text);
	msg.voice = getVoiceByLang(langSlug);
	speechSynthesis.speak(msg);
}



function getVoiceByLang(langSlug) {
	return _.find(speechSynthesis.getVoices(), function(voice) {
		if (langSlug === 'de') {
			return voice.name == 'Google Deutsch';
		}
		else if (langSlug === 'es') {
			return voice.name == 'Google Español';
		}
		else if (langSlug === 'fr') {
			return voice.name == 'Google Français';
		}

		return voice.name == 'Google UK English Female';
	});
}



function isSpeechCapable() {
	return (_.has(window, 'speechSynthesis') && _.has(window, 'SpeechSynthesisUtterance'));
}