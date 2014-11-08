/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');

var RegionMatches = React.createFactory(require('./overview/RegionMatches.jsx'));
var RegionWorlds = React.createFactory(require('./overview/RegionWorlds.jsx'));

var regions = [
	{"label": "NA Worlds", "regionId": "1"},
	{"label": "EU Worlds", "regionId": "2"},
];


module.exports = React.createClass({
	getInitialState: function() {
		return {matches: {}};
	},

	componentWillMount: function() {
	},

	componentDidMount: function() {
		this.updateTimer = null;
		this.getMatches();
	},

	componentWillUnmount: function() {
		clearTimeout(this.updateTimer);
	},
	
	render: function() {
		var lang = window.app.state.lang;
		var langSlug = lang.slug;

		var regionMatches = [
			{"label": "NA Matchups", "matches": _.filter(this.state.matches, {region: 1})},
			{"label": "EU Matchups", "matches": _.filter(this.state.matches, {region: 2})},
		];

		return (
			<div id="overview">
				<div className="row">
					{_.map(regionMatches, function(region){
						return (
							<div className="col-sm-12" key={region.label}>
								<RegionMatches region={region} />
							</div>
						);
					})}
				</div>

				<hr />

				<div className="row">
					{_.map(regions, function(region){
						return (
							<div className="col-sm-12" key={region.label}>
								<RegionWorlds region={region} />
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
		this.setState({matches: data});
	},
	getMatchesError: function(xhr, status, err) {
		console.log('Overview::getMatches:data error', status, err.toString()); 
	},
	getMatchesComplete: function() {
		var interval = _.random(2000, 4000);
		this.updateTimer = setTimeout(this.getMatches, interval);
	},
});