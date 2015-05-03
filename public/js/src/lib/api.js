'use strict';

const gw2api = require('gw2api');


module.exports = {
    getGuildDetails       : getGuildDetails,
    getMatches            : getMatches,
    getMatchDetailsByWorld: getMatchDetailsByWorld,
    // getMatchDetails    : getMatchDetails,
};



function getMatches(callback) {
    gw2api.getMatchesState(callback);
}



function getGuildDetails(guildId, callback) {
    gw2api.getGuildDetails({
        guild_id: guildId,
    }, callback);
}



// function getMatchDetails(matchId, callback) {
//   gw2api.getMatchDetailsState({match_id: matchId}, callback);
// }



function getMatchDetailsByWorld(worldSlug, callback) {
    // setTimeout(
    //  gw2api.getMatchDetailsState.bind(null, {world_slug: worldSlug}, callback),
    //  3000
    // );
    gw2api.getMatchDetailsState({
        world_slug: worldSlug,
    }, callback);
}
