/**
 * @jsx React.DOM
 */

var Scoreboard = require('./tracker/Scoreboard.jsx');
var Maps = require('./tracker/Maps.jsx');
var Guilds = require('./tracker/guilds/Guilds.jsx');

var libDate = require('../lib/date.js');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			matchDetails: {},
			scores: [],
			mapsScores: [],
			objectives: {},
			guilds: {},
		};
	},

	componentDidMount: function() {
		this.updateTimer = null;

		this.getMatchDetails();
	},

	componentWillUnmount: function() {
		clearTimeout(this.updateTimer);
		clearTimeout(this.buffTimers);
	},

	componentDidUpdate: function() {
		// console.log(this.state);
		// console.log(_.filter(this.state.objectives, function(o){ return o.lastCap !== 0; }));
	},
	
	render: function() {
		var staticData = require('../staticData');
		var appState = window.app.state;
		var matchData = this.props.data;

		var matchWorlds = [
			staticData.worlds[matchData.red_world_id],
			staticData.worlds[matchData.blue_world_id],
			staticData.worlds[matchData.green_world_id],
		];

		var matchDetails = this.state.matchDetails;

		// console.log('matchWorlds', matchWorlds);
		// console.log('matchData', matchData);
		// console.log('this.state.objectives', this.state.objectives);

		if (_.isEmpty(this.state.objectives)) {
			console.log('Objective data not ready');
			return null;
		}
		else {
			return (
				<div id="tracker">
					<Scoreboard 
						scores={this.state.scores}
						objectives={this.state.objectives}
						matchWorlds={matchWorlds}
					/>


					<Maps
						matchData={matchData}
						mapsScores={this.state.mapsScores}
						objectives={this.state.objectives}
						guilds={this.state.guilds}
						matchWorlds={matchWorlds}
					/>


					<Guilds
						guilds={this.state.guilds}
						objectives={this.state.objectives}
					/>
				</div>
			);
		}

	},








	getMatchDetails: function() {
		var api = require('../api');
		
		api.getMatchDetails(
			this.props.data.wvw_match_id,
			this.onMatchDetailsSuccess, 
			this.onMatchDetailsError, 
			this.onMatchDetailsComplete
		);
	},

	onMatchDetailsSuccess: function(data) {
		// console.log('Match::onMatchDetailsSuccess', this.props.data.wvw_match_id, data);
		var component = this;

		var objectives = getObjectives(component, data);
		// var guilds = getGuilds(component, objectives);

		this.setState({
			matchDetails: data,
			scores: data.scores,
			mapsScores: getMapsScores(data),
			objectives: objectives,
			// guilds: guilds,
		});
		
		if(!_.isEmpty(this.state.objectives)) {
			process.nextTick(queueGuildLookups.bind(this, this.state.objectives));
		}
	},

	onMatchDetailsError: function(xhr, status, err) {
		console.log('Overview::getMatchDetails:data error', status, err.toString()); 
	},

	onMatchDetailsComplete: function(xhr, status, err) {
		var refreshTime = _.random(1000*1, 1000*4);
		this.updateTimer = setTimeout(this.getMatchDetails, refreshTime);
	},
});


function getMapsScores(md) {
	return _.pluck(md.maps, 'scores');
}


function getObjectives(component, md) {
	var objectives = _
		.chain(md.maps)
		.pluck('objectives')
		.flatten()
		.map(setObjectiveLastCap.bind(component))
		.indexBy('id')
		.value();

	return objectives;
}


function setObjectiveLastCap(o) {
	var so = this.state.objectives[o.id];

	if (!so) {
		o.lastCap = window.app.state.start;
	}
	else if (o.owner === so.owner) {
		o.lastCap = so.lastCap;
	}
	else {
		o.lastCap = libDate.dateNow();
	}

	o.expires = libDate.add5(o.lastCap);

	return o;
}



function queueGuildLookups(objectives){
	var knownGuilds = _.keys(this.state.guilds);

	var newGuilds = _
		.chain(objectives)
		.pluck('owner_guild')
		.uniq()
		.without(undefined)
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
		function(data) {
			// console.log('component.state', component.state);
			// var guild = _.merge(component.state.guilds[guildId], data);
			data.objectives = _.filter(component.state.objectives, {"owner_guild": guildId});
			component.state.guilds[guildId] = data;
			component.setState({guilds: component.state.guilds});
		}, 
		_.noop,
		onComplete.bind(null, null) // so no error is returned
	);
}