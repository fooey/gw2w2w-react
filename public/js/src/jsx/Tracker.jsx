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
			log: [],
		};
	},

	componentDidMount: function() {
		this.updateTimer = null;

		this.getMatchDetails();
	},

	componentWillUnmount: function() {
		clearTimeout(this.updateTimer);
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
			return null;
		}
		else {
			var claimsLog = _.filter(this.state.log, function(entry){
				return _.has(entry.objective, 'owner_guild');
			});

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
						log={this.state.log}
					/>

					<Guilds
						guilds={this.state.guilds}
						objectives={this.state.objectives}
						claimsLog={claimsLog}
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

	var init = false;
	var ownerChanged = false;
	var claimerChanged = false;

	if (!so) {
		ownerChanged = true;
		init = true;
		o.lastCap = window.app.state.start;
	}
	else {
		ownerChanged = !_.isEqual(o.owner, so.owner);
		claimerChanged = _.has(o, 'owner_guild') && o.owner_guild && !_.isEqual(o.owner_guild, so.owner_guild);
	}



	if (ownerChanged){
		if (!init) {
			o.lastCap = libDate.dateNow();
		}
		appendToLog.call(this, {type: 'capture', objective: _.clone(o)});
	}
	else {
		if (claimerChanged) {
			appendToLog.call(this, {type: 'claim', objective: _.clone(o)});
		}
		o.lastCap = so.lastCap;
	}


	o.expires = libDate.add5(o.lastCap);

	return o;
}


function appendToLog(props) {
	props.timestamp = libDate.dateNow();
	props.logId = this.state.log.length;
	this.state.log.push(props);
	this.setState({log: this.state.log});
}

function queueGuildLookups(objectives){
	var knownGuilds = _.keys(this.state.guilds);

	var newGuilds = _
		.chain(objectives)
		.pluck('owner_guild')
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
		function(data) {
			// console.log('component.state', component.state);
			// var guild = _.merge(component.state.guilds[guildId], data);
			component.state.guilds[guildId] = data;
			component.setState({guilds: component.state.guilds});
		}, 
		_.noop,
		onComplete.bind(null, null) // so no error is returned
	);
}