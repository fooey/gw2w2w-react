
import $ from 'jQuery';
import _ from 'lodash';


export default {
    // getMatches: getMatches,
    getMatchByWorldSlug: getMatchByWorldSlug,
    getMatchByWorldId: getMatchByWorldId,
    getGuildById : getGuildById,
};



function getMatchByWorldSlug({
    worldSlug,
    success = _.noop,
    error = _.noop,
    complete = _.noop,
}) {
    $.ajax({
        url: `http://state.gw2w2w.com/world/${worldSlug}`,
        success,
        error,
        complete,
    });
}



function getMatchByWorldId({
    worldId,
    success = _.noop,
    error = _.noop,
    complete = _.noop,
}) {
    $.ajax({
        url: `http://state.gw2w2w.com/world/${worldId}`,
        success,
        error,
        complete,
    });
}



export function getGuildById({
    guildId,
    success = _.noop,
    error = _.noop,
    complete = _.noop,
}) {
    $.ajax({
        url: `https://api.guildwars2.com/v1/guild_details.json?guild_id=${guildId}`,
        success,
        error,
        complete,
    });
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
