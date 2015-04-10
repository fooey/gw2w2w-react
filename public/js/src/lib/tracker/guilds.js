
'use strict';


/*
*
*	Dependencies
*
*/

const Immutable	= require('Immutable');
const async		= require('async');

const api		= require('lib/api.js');





/*
*
*	Module Globals
*
*/

const guildDefault = Immutable.Map({
	'loaded'	: false,
	'lastClaim'	: 0,
	'claims'	: Immutable.Map(),
});


const numQueueConcurrent = 4;




/*
*
*	Public Methods
*
*/

class LibGuilds {
	constructor(component) {
		this.component = component;

		this.asyncGuildQueue = async.queue(
			this.getGuildDetails.bind(this),
			numQueueConcurrent
		);

		return this;
	}



	onMatchData(matchDetails) {
		// let component = this;
		const state = this.component.state;

		// console.log('LibGuilds::onMatchData()');

		const objectiveClaimers	= matchDetails.getIn(['objectives', 'claimers']);
		const claimEvents		=  getEventsByType(matchDetails, 'claim');
		const guildsToLookup	= getUnknownGuilds(state.guilds, objectiveClaimers, claimEvents);

		// send new guilds to async queue manager for data retrieval
		if (!guildsToLookup.isEmpty()) {
			this.asyncGuildQueue.push(guildsToLookup.toArray());
		}


		let newGuilds	= state.guilds;
		newGuilds		= initializeGuilds(newGuilds, guildsToLookup);
		newGuilds		= guildsProcessClaims(newGuilds, claimEvents);

		// update state if necessary
		if (!Immutable.is(state.guilds, newGuilds)) {
			// console.log('guilds::onMatchData()', 'has update');
			this.component.setState({guilds: newGuilds});
		}
	}



	getGuildDetails(guildId, onComplete) {
		let component	= this.component;
		const state		= component.state;
		const hasData	= state.guilds.getIn([guildId, 'loaded']);

		if (hasData) {
			// console.log('Tracker::getGuildDetails()', 'skip', guildId);
			onComplete(null);
		}
		else {
			// console.log('Tracker::getGuildDetails()', 'lookup', guildId);
			api.getGuildDetails(
				guildId,
				onGuildData.bind(this, onComplete)
			);
		}
	}
}







/*
*
*	Private Methods
*
*/

function onGuildData(onComplete, err, data) {
	let component = this.component;
	let state = component.state;

	if (component.mounted) {
		if (!err && data) {
			delete data.emblem;

			data.loaded = true;

			const guildId	= data.guild_id;
			const guildData	= Immutable.fromJS(data);

			component.setState(state => ({
				guilds: state.guilds.mergeIn([guildId], guildData)
			}));
		}

	}

	onComplete(null);
}



function guildsProcessClaims(guilds, claimEvents) {
	// console.log('guildsProcessClaims()', guilds.size);

	return guilds.map(
		guildAttachClaims.bind(null, claimEvents)
	);
}



function guildAttachClaims(claimEvents, guild, guildId) {
	const incClaims = claimEvents
		.filter(entry => entry.get('guild') === guildId)
		.toMap();

	const hasClaims			= !guild.get('claims').isEmpty();
	const newestClaim		= hasClaims ? guild.get('claims').first() : null;
	const incHasClaims		= !incClaims.isEmpty();
	const incNewestClaim	= incHasClaims ? incClaims.first() : null;

	const hasNewClaims		= (!Immutable.is(newestClaim, incNewestClaim));


	if (hasNewClaims) {
		const lastClaim = incHasClaims ? incNewestClaim.get('timestamp') : 0;
		// console.log('claims altered', guildId, hasNewClaims, lastClaim);
		guild	= guild.set('claims', incClaims);
		guild	= guild.set('lastClaim', lastClaim);
	}

	return guild;
}



function initializeGuilds(guilds, newGuilds) {
	// console.log('initializeGuilds()');
	// console.log('newGuilds', newGuilds);

	newGuilds.forEach(guildId => {
		if (!guilds.has(guildId)) {
			let guild = guildDefault.set('guild_id', guildId);
			guilds = guilds.set(guildId, guild);
		}
	});

	return guilds;
}



function getEventsByType(matchDetails, eventType) {
	return matchDetails
		.get('history')
		.filter(entry => entry.get('type') === eventType)
		.sortBy(entry => -entry.get('timestamp'));
}



function getUnknownGuilds(stateGuilds, objectiveClaimers, claimEvents) {
	const guildsWithCurrentClaims = objectiveClaimers
		.map(entry => entry.get('guild'))
		.toSet();

	const guildsWithPreviousClaims = claimEvents
		.map(entry => entry.get('guild'))
		.toSet();

	const guildClaims = guildsWithCurrentClaims
		.union(guildsWithPreviousClaims);


	const knownGuilds = stateGuilds
		.map(entry => entry.get('guild_id'))
		.toSet();

	const unknownGuilds = guildClaims
		.subtract(knownGuilds);


	// console.log('guildClaims', guildClaims.toArray());
	// console.log('knownGuilds', knownGuilds.toArray());
	// console.log('unknownGuilds', unknownGuilds.toArray());

	return unknownGuilds;
}





/*
*
*	Export Module
*
*/

module.exports = LibGuilds;
