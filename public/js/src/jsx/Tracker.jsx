/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');
var async = require('async');

var Scoreboard = require('./tracker/Scoreboard.jsx');
var Maps = require('./tracker/Maps.jsx');
var Guilds = require('./tracker/guilds/Guilds.jsx');

var staticData = require('gw2w2w-static');
var worldsStatic = staticData.worlds;

module.exports = React.createClass({
	getInitialState: function() {
		return {
			match: [],
			details: [],
			guilds: {},
			lastmod: 0,
			timeOffset: 0,
		};
	},

	componentDidMount: function() {
		this.updateTimer = null;

		this.getMatchDetails();
	},

	componentWillUnmount: function() {
		clearTimeout(this.updateTimer);
	},

	// componentDidUpdate: function() {
	// 	// console.log(this.state);
	// 	// console.log(_.filter(this.state.objectives, function(o){ return o.lastCap !== 0; }));
	// },

	render: function() {
		var lang = this.props.lang;
		var world = this.props.world;

		var details = this.state.details;


		if (_.isEmpty(details) || details.initialized === false) {
			return null;
		}
		else {
			var timeOffset = this.state.timeOffset;
			var match = this.state.match;
			var guilds = this.state.guilds;

			var eventHistory = details.history;
			var scores = match.scores;
			var ticks = match.ticks;
			var holdings = match.holdings;

			var redWorld = worldsStatic[match.redId][lang.slug];
			var blueWorld = worldsStatic[match.blueId][lang.slug];
			var greenWorld = worldsStatic[match.greenId][lang.slug];

			var matchWorlds = {
				"red": {
					"world": redWorld,
					"score": scores[0],
					"tick": ticks[0],
					"holding": holdings[0],
				},
				"blue": {
					"world": blueWorld,
					"score": scores[1],
					"tick": ticks[1],
					"holding": holdings[1],
				},
				"green": {
					"world": greenWorld,
					"score": scores[2],
					"tick": ticks[2],
					"holding": holdings[2],
				},
			};

			setPageTitle(lang, world);


			var mapsMeta = [
				{
					'index': 0,
					'name': 'RedHome' ,
					'long': 'RedHome - ' + matchWorlds.red.name,
					'abbr': 'Red',
					'color': 'red',
					'world': matchWorlds.red
				}, {
					'index': 1,
					'name': 'GreenHome',
					'long': 'GreenHome - ' + matchWorlds.green.name,
					'abbr': 'Grn',
					'color': 'green',
					'world': matchWorlds.green
				}, {
					'index': 2,
					'name': 'BlueHome',
					'long': 'BlueHome - ' + matchWorlds.blue.name,
					'abbr': 'Blu',
					'color': 'blue',
					'world': matchWorlds.blue
				}, {
					'index': 3,
					'name': 'Eternal Battlegrounds',
					'long': 'Eternal Battlegrounds',
					'abbr': 'EBG',
					'color': 'neutral',
					'world': null
				},
			];

			return (
				<div id="tracker">

					<Scoreboard
						lang={lang}
						matchWorlds={matchWorlds}
					/>

					<Maps
						timeOffset={timeOffset}
						lang={lang}
						details={details}
						matchWorlds={matchWorlds}
						mapsMeta={mapsMeta}
						guilds={guilds}
					/>

					<hr />

					<Guilds
						lang={lang}
						timeOffset={timeOffset}
						guilds={guilds}
						eventHistory={eventHistory}
						mapsMeta={mapsMeta}
					/>

				</div>
			);
		}

	},







	getMatchDetails: function() {
		var api = require('../api');

		var world = this.props.world;
		var lang = this.props.lang;
		var worldSlug = world[lang.slug].slug;

		api.getMatchDetailsByWorld(
			worldSlug,
			this.onMatchDetails
		);
	},

	onMatchDetails: function(err, data) {
		if (!err) {
			var msOffset = Date.now() - data.now;
			var secOffset = Math.floor(msOffset / 1000);

			this.setState({
				lastmod: data.now,
				timeOffset: secOffset,
				match: data.match,
				details: data.details,
			});

			var claimCurrent = _.pluck(data.details.objectives.claimers, 'guild');
			var claimHistory = _.chain(data.details.history)
				.filter({type: 'claim'})
				.pluck('guild')
				.value();

			var guilds = claimCurrent.concat(claimHistory);

			if(guilds.length) {
				process.nextTick(queueGuildLookups.bind(this, guilds));
			}
		}

		var refreshTime = _.random(1000*2, 1000*4);
		this.updateTimer = setTimeout(this.getMatchDetails, refreshTime);
	},
});




function queueGuildLookups(guilds){
	var knownGuilds = _.keys(this.state.guilds);

	var newGuilds = _
		.chain(guilds)
		.uniq()
		.without(undefined, null)
		.difference(knownGuilds)
		.value();

	async.eachLimit(
		newGuilds,
		4,
		getGuildDetails.bind(this)
	);
}

function getGuildDetails(guildId, onComplete) {
	var api = require('../api');
	var component = this;

	api.getGuildDetails(
		guildId,
		function(err, data) {
			if(!err) {
				component.state.guilds[guildId] = data;
				component.setState({guilds: component.state.guilds});
			}
			onComplete();
		}
	);
}




function setPageTitle(lang, world) {
	var $ = require('jquery');
	var title = [world[lang.slug].name, 'gw2w2w'];

	if (lang.slug !== 'en') {
		title.push(lang.name);
	}

	$('title').text(title.join(' - '));
}