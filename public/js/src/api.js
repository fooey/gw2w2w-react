
module.exports = {
	getGuildDetails: getGuildDetails,
	getMatches: getMatches,
	getMatchDetails: getMatchDetails,
};



function getGuildDetails(guildId, onSuccess, onError, onComplete) {
	var requestUrl = 'https://api.guildwars2.com/v1/guild_details.json?guild_id=' + guildId;
	get(requestUrl, onSuccess, onError, onComplete);
}



function getMatches(onSuccess, onError, onComplete) {
	var requestUrl = 'https://api.guildwars2.com/v1/wvw/matches.json';
	get(requestUrl, onSuccess, onError, onComplete);
}



function getMatchDetails(matchId, onSuccess, onError, onComplete) {
	var requestUrl = 'https://api.guildwars2.com/v1/wvw/match_details.json?match_id=' + matchId;
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


