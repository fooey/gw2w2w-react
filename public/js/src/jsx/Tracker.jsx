'use strict';


/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim
var $ = require('jquery');		// browserify shim
var async = require('async');	// browserify shim
var moment = require('moment');	// browserify shim

var api = require('../api');
var libDate = require('../lib/date.js');
var trackerTimers = require('../lib/trackerTimers');





/*
*	React Components
*/

var Scoreboard = require('./tracker/Scoreboard.jsx');
var Maps = require('./tracker/Maps.jsx');
// var Options = require('./tracker/Options.jsx');
var Guilds = require('./tracker/Guilds.jsx');





/*
*	Component Globals
*/

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


	updateTimers: updateTimers,

	getMatchDetails: getMatchDetails,
	onMatchDetails: onMatchDetails,

	queueGuildLookups: queueGuildLookups,
	getGuildDetails: getGuildDetails,

	// setOptions: setOptions,
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

		// dateNow: libDate.dateNow(),
		lastmod: 0,
		timeOffset: 0,

		match: [],
		details: [],
		guilds: {},
		// options: Options.getDefaultOptions(),
	};
}



function componentWillMount() {
	// var component = this;
}



function componentDidMount() {
	var component = this;
	// window.console.log('Tracker::componentDidMount');

	component.intervals = {
		timers: null,
	};
	component.timeouts = {
		data: null,
	};

	component.intervals.timers = window.setInterval(component.updateTimers, 1000);
	process.nextTick(component.updateTimers);

	process.nextTick(component.getMatchDetails);
}



function shouldComponentUpdate(nextProps, nextState) {
	// var component = this;
	// var props = component.props;
	// var state = component.state;

	// var langChanged = (props.lang !== nextProps.lang);
	// var isModified = (state.lastmod !== nextState.lastmod);
	// var newGuildData = !_.isEqual(state.guilds, nextState.guilds);
	// // console.log('newGuildData', newGuildData,_.isEqual(state.guilds, nextState.guilds));
	// var shouldUpdate = (isModified || langChanged || newGuildData);

	// console.log(Date.now(), shouldUpdate);

	return true;
}



function componentWillUnmount() {
	var component = this;

	_.each(component.intervals, function(windowInterval) {
		window.clearInterval(windowInterval);
	});
	_.each(component.timeouts, function(windowTimeout) {
		window.clearInterval(windowTimeout);
	});
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


		// var dateNow = state.dateNow;
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

					details={details}
					matchWorlds={matchWorlds}
					guilds={guilds}
				/>

				<div className="row">
					<div className="col-sm-6">
					</div>
					<div className="col-sm-18">
						<Guilds
							lang={lang}

							guilds={guilds}
							eventHistory={eventHistory}
						/>
					</div>
				</div>

			</div>
		);
	}

	/*
						<Options
							options={state.options}
							setOptions={component.setOptions}
						/>
	*/

}




/*
*	Component Helper Methods
*/

// function tick() {
// 	var component = this;

// 	if(component.isMounted()) {
// 		component.setState({dateNow: libDate.dateNow()});
// 	}
// }


function updateTimers() {
	var component = this;

	if(component.isMounted()) {
		var state = component.state;
		var timeOffset = state.timeOffset;
		var now = libDate.dateNow() - timeOffset;

		trackerTimers.update(now, timeOffset);
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
	var state = component.state;


	if(component.isMounted()) {
		if (!err && data && data.match && data.details) {

			var isModified = (data.match.lastmod !== state.match.lastmod);

			if (isModified) {
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
	}
	else {
		component.setState({
			hasData: false,
		});
	}

	var refreshTime = _.random(1000*2, 1000*4);
	component.timeouts.data = window.setTimeout(component.getMatchDetails, refreshTime);

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
				if(component.isMounted()) {
					state.guilds[guildId] = data;
					component.setState({guilds: state.guilds});
				}
			}
			onComplete();
		}
	);
}



// function setOptions(newOptions) {
// 	var component = this;
// 	var props = component.props;

// 	console.log('Tracker::setOptions', newOptions);

// 	component.setState({options: newOptions});
// }





/*
*
*	Private Methods
*
*/

function setPageTitle(lang, world) {
	var title = [world[lang.slug].name, 'gw2w2w'];

	if (lang.slug !== 'en') {
		title.push(lang.name);
	}

	$('title').text(title.join(' - '));
}