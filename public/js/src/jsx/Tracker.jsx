'use strict';


/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim
var async = require('async');	// browserify shim

var api = require('../api');





/*
*	React Components
*/

var Scoreboard = require('./tracker/Scoreboard.jsx');
var Maps = require('./tracker/Maps.jsx');
var Guilds = require('./tracker/guilds/Guilds.jsx');





/*
*	Component Globals
*/

var libDate = require('../lib/date.js');
var staticData = require('gw2w2w-static');
var worldsStatic = staticData.worlds;





/*
*	Component Export
*/

module.exports = React.createClass({
	getInitialState: getInitialState,
	componentWillMount: componentWillMount,
	componentDidMount: componentDidMount,
	shouldComponentUpdate: shouldComponentUpdate,
	componentWillUnmount: componentWillUnmount,
	render: render,


	tick: tick,

	getMatchDetails: getMatchDetails,
	onMatchDetails: onMatchDetails,

	queueGuildLookups: queueGuildLookups,
	getGuildDetails: getGuildDetails,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function getInitialState() {
	var component = this;

	return {
		hasData: false,

		dateNow: libDate.dateNow(),
		lastmod: 0,
		timeOffset: 0,

		match: [],
		details: [],
		guilds: {},
	};
}



function componentWillMount() {
	var component = this;
}



function componentDidMount() {
	var component = this;

	component.interval = setInterval(component.tick, 1000);

	component.updateTimer = null;
	process.nextTick(component.getMatchDetails);
}



function shouldComponentUpdate(nextProps, nextState) {
	var component = this;
	var props = component.props;
	var state = component.state;

	// don't update more often than once per second
	// helps greatly during initialization while guilds are loading

	var isNewTick = (state.dateNow !== nextState.dateNow);
	var langChange = (props.lang !== nextProps.lang);
	var shouldUpdate = (isNewTick || langChange);

	// console.log(shouldUpdate, isFirstUpdate, isNewNow);

	return shouldUpdate;
}



function componentWillUnmount() {
	var component = this;

	clearTimeout(component.updateTimer);
	clearInterval(component.interval);
}



function render() {
	var component = this;
	var props = component.props;
	var state = component.state;

	var lang = props.lang;
	var world = props.world;

	var details = state.details;


	if (false && !state.hasData) {
		return null;
	}
	else {
		setPageTitle(lang, world);


		var dateNow = state.dateNow;
		var timeOffset = state.timeOffset;
		var match = state.match;
		var guilds = state.guilds;

		var eventHistory = details.history;
		var scores = match.scores || [0,0,0];
		var ticks = match.ticks || [0,0,0];
		var holdings = match.holdings || [0,0,0];

		var matchWorlds = {
			"red": {
				"world": worldsStatic[match.redId],
				"score": scores[0],
				"tick": ticks[0],
				"holding": holdings[0],
			},
			"blue": {
				"world": worldsStatic[match.blueId],
				"score": scores[1],
				"tick": ticks[1],
				"holding": holdings[1],
			},
			"green": {
				"world": worldsStatic[match.greenId],
				"score": scores[2],
				"tick": ticks[2],
				"holding": holdings[2],
			},
		};



		return (
			<div id="tracker">

				<Scoreboard
					lang={lang}

					matchWorlds={matchWorlds}
				/>

				<Maps
					lang={lang}
					timeOffset={timeOffset}
					dateNow={dateNow}

					details={details}
					matchWorlds={matchWorlds}
					guilds={guilds}
				/>

				<Guilds
					lang={lang}
					timeOffset={timeOffset}
					dateNow={dateNow}

					guilds={guilds}
					eventHistory={eventHistory}
				/>

			</div>
		);
	}

}




/*
*	Component Helper Methods
*/

function tick() {
	var component = this;

	if(component.isMounted()) {
		component.setState({dateNow: libDate.dateNow()});
	}
}



function getMatchDetails() {
	var component = this;
	var props = component.props;

	var world = props.world;
	var lang = props.lang;
	var worldSlug = world[lang.slug].slug;

	api.getMatchDetailsByWorld(
		worldSlug,
		component.onMatchDetails
	);
}



function onMatchDetails(err, data) {
	var component = this;
	var props = component.props;

	if(component.isMounted()) {
		if (!err) {
			var msOffset = Date.now() - data.now;
			var secOffset = Math.floor(msOffset / 1000);

			component.setState({
				hasData: true,
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
				process.nextTick(component.queueGuildLookups.bind(null, guilds));
			}
		}
	}
	else {
		component.setState({
			hasData: false,
		});
	}

	var refreshTime = _.random(1000*2, 1000*4);
	component.updateTimer = setTimeout(component.getMatchDetails, refreshTime);

}




function queueGuildLookups(guilds){
	var component = this;
	var state = component.state;

	var knownGuilds = _.keys(state.guilds);

	var newGuilds = _
		.chain(guilds)
		.uniq()
		.without(undefined, null)
		.difference(knownGuilds)
		.value();


	if(component.isMounted()) {
		async.eachLimit(
			newGuilds,
			4,
			component.getGuildDetails
		);
	}
}



function getGuildDetails(guildId, onComplete) {
	var component = this;
	var state = component.state;

	api.getGuildDetails(
		guildId,
		function(err, data) {
			if(!err) {
				state.guilds[guildId] = data;

				if(component.isMounted()) {
					component.setState({guilds: state.guilds});
				}
			}
			onComplete();
		}
	);
}





/*
*
*	Private Methods
*
*/

function setPageTitle(lang, world) {
	var $ = require('jquery');
	var title = [world[lang.slug].name, 'gw2w2w'];

	if (lang.slug !== 'en') {
		title.push(lang.name);
	}

	$('title').text(title.join(' - '));
}