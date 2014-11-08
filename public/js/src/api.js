
module.exports = {
	getGuildDetails: getGuildDetails,
	getMatches: getMatches,
	getMatchDetails: getMatchDetails,
	getMatchDetailsByWorld: getMatchDetailsByWorld,
};



function getGuildDetails(guildId, onSuccess, onError, onComplete) {
	var requestUrl = 'https://api.guildwars2.com/v1/guild_details.json?guild_id=' + guildId;
	get(requestUrl, onSuccess, onError, onComplete);
}



function getMatches(onSuccess, onError, onComplete) {
	var requestUrl = 'http://state.gw2w2w.com/matches';
	get(requestUrl, onSuccess, onError, onComplete);
}



function getMatchDetails(matchId, onSuccess, onError, onComplete) {
	var requestUrl = 'http://state.gw2w2w.com/' + matchId;
	get(requestUrl, onSuccess, onError, onComplete);
}

function getMatchDetailsByWorld(worldSlug, onSuccess, onError, onComplete) {
	var requestUrl = 'http://state.gw2w2w.com/world/' + worldSlug;
	get(requestUrl, onSuccess, onError, onComplete);
}



function get(url, onSuccess, onError, onComplete) {
	$.ajax({
		url: url,
		dataType: 'json',
		success: onSuccess,
		error: onError,
		complete: onComplete,
	});
}


