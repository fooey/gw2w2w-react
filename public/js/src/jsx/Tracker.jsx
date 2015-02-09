'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import async from 'async';	// browserify shim

import _ from 'lodash';


import api from '../api';
import libDate from '../lib/date.js';
import libAudio from '../lib/audio.js';
import trackerTimers from '../lib/trackerTimers';

import STATIC from 'gw2w2w-static';


/*
*	React Components
*/

import Scoreboard from './tracker/Scoreboard.jsx';
import Maps from './tracker/Maps.jsx';
import Options from './tracker/Options.jsx';
import Guilds from './tracker/Guilds.jsx';


var defaultOptions = {
	audio: {
		enabled: false,
	}
};




/*
*
*	Component Export
*
*/

class Tracker extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hasData: false,

			dateNow: libDate.dateNow(),
			lastmod: 0,
			timeOffset: 0,

			match: [],
			matchWorlds: [],
			details: [],
			claimEvents: [],
			guilds: {},
			options: _.defaults(defaultOptions, {})
		};

		// console.log(this.state.options);

		this.mounted = true;

		this.intervals = {
			timers: null
		};
		this.timeouts = {
			data: null
		};

		var numQueueConcurrent = 4;
		this.getGuildDetails = getGuildDetails.bind(this);
		this.asyncGuildQueue = async.queue(this.getGuildDetails, numQueueConcurrent);
	}


	shouldComponentUpdate(nextProps, nextState) {
		return (
			!_.isEqual(this.props, nextProps)
			|| !_.isEqual(this.state, nextState)
		);
	}



	componentDidMount() {
		this.intervals.timers = setInterval(updateTimers.bind(this), 1000);
		setTimeout(updateTimers.bind(this), 0);

		setTimeout(getMatchDetails.bind(this), 0);
	}



	componentWillUnmount() {
		this.mounted = false;

		_.each(this.intervals, windowInterval => clearInterval(windowInterval));
		_.each(this.timeouts, windowTimeout => clearInterval(windowTimeout));
	}



	render() {
		var component = this;
		var props = this.props;
		var state = this.state;


		if (!state.hasData) {
			return null;
		}
		else {
			setPageTitle(props.lang, props.world);

			// console.log('Tracker::render()');


			return (
				<div id="tracker">

					<Scoreboard
						lang={props.lang}
						matchWorlds={state.matchWorlds}
					/>

					<Maps
						lang={props.lang}
						libAudio={libAudio}
						options={state.options}

						details={state.details}
						matchWorlds={state.matchWorlds}
						guilds={state.guilds}
					/>

					<div className="row">
						<div className="col-md-6">
							<Options
								lang={props.lang}
								options={state.options}
								setOptions={setOptions.bind(component)}
							/>
						</div>
						<div className="col-md-18">
							{(!_.isEmpty(state.guilds))
								? <Guilds
									lang={props.lang}

									guilds={state.guilds}
									claimEvents={state.claimEvents}
								/>
								: null
							}
						</div>
					</div>

				</div>
			);
		}

	}

}



/*
*	Class Properties
*/

Tracker.propTypes = {
	lang: React.PropTypes.object.isRequired,
	world: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default Tracker;





/*
*
*	Private Methods
*
*/



/*
*	Timers
*/

function updateTimers() {
	var component = this;

	if (component.mounted) {
		var state = component.state;
		var timeOffset = state.timeOffset;
		var now = libDate.dateNow() - timeOffset;

		trackerTimers.update(now, timeOffset);
	}
}



/*
*	Match Data
*/

function getMatchDetails() {
	var component = this;
	var props = component.props;

	var world = props.world;
	var lang = props.lang;
	var worldSlug = world[lang.slug].slug;

	api.getMatchDetailsByWorld(
		worldSlug,
		onMatchDetails.bind(component)
	);
}



function onMatchDetails(err, data) {
	var component = this;
	// var props = component.props;
	var state = component.state;


	if (component.mounted) {
		if (!err && data && data.match && data.details) {

			var isModified = (data.match.lastmod !== state.match.lastmod);

			if (isModified) {
				var msOffset = Date.now() - data.now;
				var secOffset = Math.floor(msOffset / 1000);


				var claimEvents = _.chain(data.details.history)
					.filter({type: 'claim'})
					.sortBy('timestamp')
					.reverse()
					.value();

				var claimCurrent = _.pluck(data.details.objectives.claimers, 'guild');
				var claimHistory = _.pluck(claimEvents, 'guild');

				var guilds = claimCurrent.concat(claimHistory);


				component.setState({
					hasData: true,
					dateNow: libDate.dateNow(),
					lastmod: data.now,
					timeOffset: secOffset,
					match: data.match,
					matchWorlds: getMatchWorlds(data.match),
					details: data.details,
					claimEvents,
				});


				if (guilds.length) {
					component.asyncGuildQueue.push(guilds);
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
	this.timeouts.data = setTimeout(getMatchDetails.bind(component), refreshTime);

}




/*
*	Guild Data
*/

function getGuildDetails(guildId, onComplete) {
	// var guildId = queueData.guildId;
	var component = this;
	var state = component.state;

	if (_.has(state.guilds, guildId)) {
		onComplete(null);
	}
	else {
		api.getGuildDetails(
			guildId,
			onGuildData.bind(component, onComplete)
		);
	}
}



function onGuildData(onComplete, err, data) {
	var component = this;
	var state = component.state;

	if (component.mounted) {
		if (!err && data) {
			delete data.emblem;

			var guild = _.indexBy([data], 'guild_id');

			var mergedGuilds = React.addons.update(
				state.guilds,
				{$merge: guild}
			);

			component.setState({guilds: mergedGuilds});
		}

	}
	onComplete(null);

}



/*
*	Misc
*/

function getMatchWorlds(match) {
	var scores = match.scores || [0,0,0];
	var ticks = match.ticks || [0,0,0];
	var holdings = match.holdings || [0,0,0];

	return {
		"red": {
			"world": STATIC.worlds[match.redId],
			"score": scores[0],
			"tick": ticks[0],
			"holding": holdings[0],
		},
		"blue": {
			"world": STATIC.worlds[match.blueId],
			"score": scores[1],
			"tick": ticks[1],
			"holding": holdings[1],
		},
		"green": {
			"world": STATIC.worlds[match.greenId],
			"score": scores[2],
			"tick": ticks[2],
			"holding": holdings[2],
		}
	};
}



function setOptions(newOptions) {
	var component = this;

	// console.log('Tracker::setOptions', newOptions);

	component.setState({options: newOptions});
}





function setPageTitle(lang, world) {
	var title = [world[lang.slug].name, 'gw2w2w'];

	if (lang.slug !== 'en') {
		title.push(lang.name);
	}

	$('title').text(title.join(' - '));
}
