var React = require('React');

var Scoreboard = React.createFactory(require('./tracker/Scoreboard.jsx'));
var Maps = React.createFactory(require('./tracker/Maps.jsx'));
var Guilds = React.createFactory(require('./tracker/guilds/Guilds.jsx'));

var libDate = require('../lib/date.js');
var staticData = require('gw2w2w-static');
var worlds = staticData.worlds;

module.exports = React.createClass({
	getInitialState: function() {
		return {
			match: [],
			details: [],
			guilds: {},
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
		var lang = window.app.state.lang;
		var langSlug = lang.slug;

		var details = this.state.details;


		if (_.isEmpty(this.state.details) || this.state.details.initialized === false) {
			return null;
		}
		else {
			var match = this.state.match;
			var guilds = this.state.guilds;
			
			var eventHistory = details.history;

			var matchWorlds = _.map(
				[match.redId, match.blueId, match.greenId],
				function(worldId, worldIndex) {
					var world = worlds[worldId][langSlug];
					world.link = '/' + langSlug + '/' + world.slug;
					world.color = ['red','blue','green'][worldIndex];
					return world;
				}
			);

			var mapsMeta = [
				{
					'index': 0,
					'name': 'RedHome' ,
					'long': 'RedHome - ' + matchWorlds[0].name,
					'abbr': 'Red',
					'color': 'red',
					'world': matchWorlds[0]
				}, {
					'index': 1,
					'name': 'GreenHome',
					'long': 'GreenHome - ' + matchWorlds[2].name,
					'abbr': 'Grn',
					'color': 'green',
					'world': matchWorlds[2]
				}, {
					'index': 2,
					'name': 'BlueHome',
					'long': 'BlueHome - ' + matchWorlds[1].name,
					'abbr': 'Blu',
					'color': 'blue',
					'world': matchWorlds[1]
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
						match={match}
						matchWorlds={matchWorlds}
						mapsMeta={mapsMeta}
					/>

					<Maps
						details={details}
						matchWorlds={matchWorlds}
						mapsMeta={mapsMeta}
						guilds={guilds}
					/>
					
					<hr />

					<Guilds
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
		
		api.getMatchDetailsByWorld(
			this.props.worldSlug,
			this.onMatchDetailsSuccess, 
			this.onMatchDetailsError, 
			this.onMatchDetailsComplete
		);
	},

	onMatchDetailsSuccess: function(data) {
		// console.log('Match::onMatchDetailsSuccess', this.props.data.wvw_match_id, data);
		var component = this;

		this.setState({
			match: data.match,
			details: data.details,
			// guilds: guilds,
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
	},

	onMatchDetailsError: function(xhr, status, err) {
		console.log('Overview::getMatchDetails:data error', status, err.toString()); 
	},

	onMatchDetailsComplete: function(xhr, status, err) {
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