/**
 * @jsx React.DOM
 */

var RegionMatches = require('./overview/RegionMatches.jsx');
var RegionWorlds = require('./overview/RegionWorlds.jsx');

module.exports = React.createClass({
	getInitialState: function() {
		return {matches: {}};
	},

	componentDidMount: function() {
		this.updateTimer = null;
		this.getMatches();
	},

	componentWillUnmount: function() {
		clearTimeout(this.updateTimer);
	},
	
	render: function() {
		// var appState = window.app.state;
		var staticData = require('../staticData');

		var regionMatches = [
			{"label": "NA Matchups", "matches": _.filter(this.state.matches, function(match){return match.wvw_match_id.charAt(0) === '1'; })},
			{"label": "EU Matchups", "matches": _.filter(this.state.matches, function(match){return match.wvw_match_id.charAt(0) === '2'; })},
		];
		var regionWorlds = [
			{"label": "NA Worlds", "worlds": _.filter(staticData.worlds, function(world){return world.id.charAt(0) === '1'; })},
			{"label": "EU Worlds", "worlds": _.filter(staticData.worlds, function(world){return world.id.charAt(0) === '2'; })},
		];

		return (
			<div id="overview">
				<div className="row">
					{_.map(regionMatches, function(region){
						return (
							<div className="col-sm-12" key={region.label}>
								<RegionMatches data={region} />
							</div>
						);
					})}
				</div>

				<hr />

				<div className="row">
					{_.map(regionWorlds, function(region){
						return (
							<div className="col-sm-12" key={region.label}>
								<RegionWorlds data={region} />
							</div>
						);
					})}
				</div>
			</div>
		);
	},



	getMatches: function() {
		var api = require('../api');

		api.getMatches(
			this.getMatchesSuccess,
			this.getMatchesError,
			this.getMatchesComplete
		);

	},

	getMatchesSuccess: function(data) {
		this.setState({matches: _.sortBy(data.wvw_matches, 'wvw_match_id')});
	},
	getMatchesError: function(xhr, status, err) {
		console.log('Overview::getMatches:data error', status, err.toString()); 
	},
	getMatchesComplete: _.noop,
});