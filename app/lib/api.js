
import request from 'superagent';

const noop = () => null;


export default {
    getMatches,
    getMatchByWorldSlug,
    getMatchByWorldId,
    getGuildById,
};


export function getMatches({
    success = noop,
    error = noop,
    complete = noop,
}) {
    // console.log('api::getMatches()');

    request
        .get(`https://state.gw2w2w.com/matches`)
        .end(onRequest.bind(this, {success, error, complete}));
}



export function getMatchByWorldSlug({
    worldSlug,
    success = noop,
    error = noop,
    complete = noop,
}) {
    // console.log('api::getMatchByWorldSlug()');

    request
        .get(`https://state.gw2w2w.com/world/${worldSlug}`)
        .end(onRequest.bind(this, {success, error, complete}));
}



export function getMatchByWorldId({
    worldId,
    success = noop,
    error = noop,
    complete = noop,
}) {
    // console.log('api::getMatchByWorldId()');

    request
        .get(`https://state.gw2w2w.com/world/${worldId}`)
        .end(onRequest.bind(this, {success, error, complete}));
}



export function getGuildById({
    guildId,
    success = noop,
    error = noop,
    complete = noop,
}) {
    // console.log('api::getGuildById()');

    request
        .get(`https://api.guildwars2.com/v1/guild_details.json?guild_id=${guildId}`)
        .end(onRequest.bind(this, {success, error, complete}));
}





function onRequest(callbacks, err, res) {
    // console.log('api::onRequest()', err, res && res.body);

    if (err || res.error) {
        callbacks.error(err);
    }
    else {
        callbacks.success(res.body);
    }

    callbacks.complete();
}