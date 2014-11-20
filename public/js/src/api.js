"use strict";

var gw2api = require('gw2api');


module.exports = {
	getGuildDetails: getGuildDetails,
	getMatches: getMatches,
	// getMatchDetails: getMatchDetails,
	getMatchDetailsByWorld: getMatchDetailsByWorld,
};



function getMatches(callback) {
	gw2api.getMatchesState(callback);
}



function getGuildDetails(guildId, callback) {
	gw2api.getGuildDetails({guild_id: guildId}, callback);
}



function getMatchDetails(matchId, callback) {
	gw2api.getMatchDetailsState({match_id: matchId}, callback);
}



function getMatchDetailsByWorld(worldSlug, callback) {
	gw2api.getMatchDetailsState({world_slug: worldSlug}, callback);
}
