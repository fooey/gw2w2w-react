"use strict";


/*
 *
 * Dependencies
 *
 */

const Immutable = require('Immutable');
const async     = require('async');

const api       = require('lib/api');





/*
 *
 * Module Globals
 *
 */

const guildDefault = Immutable.Map({
    loaded    : false,
    lastClaim : 0,
    claims    : Immutable.Map(),
});


const numQueueConcurrent = 8;




/*
 *
 * Public Methods
 *
 */

class LibGuilds {
    constructor() {
        // this.component = component;

        this.__asyncGuildQueue = async.queue(
            getGuildDetails,
            numQueueConcurrent
        );
    }


    getGuildDefault() {
        return guildDefault;
    }



    getEventsByType(matchDetails, eventType) {
        return matchDetails
            .get('history')
            .filter(entry => entry.get('type') === eventType)
            // .sortBy(entry => -entry.get('timestamp'));
    }


    getUnknownGuilds(stateGuilds, matchDetails) {
        const claimEvents       = this.getEventsByType(matchDetails, 'claim');
        const objectiveClaimers = matchDetails.getIn(['objectives', 'claimers']);

        const knownGuilds = stateGuilds
            .map(entry => entry.get('guild_id'))
            .toSet();


        const guildsWithCurrentClaims = objectiveClaimers
            .map(entry => entry.get('guild'))
            .toSet();

        const guildsWithPreviousClaims = claimEvents
            .map(entry => entry.get('guild'))
            .toSet();

        const guildClaims = guildsWithCurrentClaims
            .union(guildsWithPreviousClaims);



        const unknownGuilds = guildClaims
            .subtract(knownGuilds);


        // console.log('guildClaims', guildClaims.toArray());
        // console.log('knownGuilds', knownGuilds.toArray());
        // console.log('unknownGuilds', unknownGuilds.toArray());

        return unknownGuilds;
    }



    lookup(knownGuilds, matchDetails, listener) {
        const unknownGuilds = this.getUnknownGuilds(knownGuilds, matchDetails);
        const defaultGuild = this.getGuildDefault();

        unknownGuilds.forEach(guildId => {

            // initialize
            const guild = defaultGuild.set('guild_id', guildId);
            listener(guild, guildId);

            // get from remote
            this.__asyncGuildQueue.push({
                guildId,
                listener
            });

        });
    }



    attachClaims(claimEvents, guild) {
        const guildId = guild.get('guild_id');
        const incClaims = claimEvents
            .filter(entry => entry.get('guild') === guildId)
            .toMap();

        const hasClaims      = guild.get('claims') && !guild.get('claims').isEmpty();
        const newestClaim    = hasClaims ? guild.get('claims').first() : null;
        const incHasClaims   = !incClaims.isEmpty();
        const incNewestClaim = incHasClaims ? incClaims.first() : null;

        const hasNewClaims   = (!Immutable.is(newestClaim, incNewestClaim));


        if (hasNewClaims) {
            const lastClaim = incHasClaims ? incNewestClaim.get('timestamp') : 0;
            // console.log('claims altered', guildId, hasNewClaims, lastClaim);
            guild = guild.set('claims', incClaims);
            guild = guild.set('lastClaim', lastClaim);
        }

        return guild;
    }
}







/*
 *
 * Private Methods
 *
 */



function getGuildDetails(cargo, onComplete) {
    api.getGuildDetails(
        cargo.guildId,
        onGuildData.bind(null, cargo)
    );

    onComplete();
}



function onGuildData(cargo, err, data) {
    if (!err && data) {
        delete data.emblem;
        data.loaded = true;

        const guildData = Immutable.fromJS(data);

        cargo.listener(guildData, cargo.guildId);
    }
}








/*
 *
 * Export Module
 *
 */

module.exports = LibGuilds;
