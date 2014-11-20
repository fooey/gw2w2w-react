/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');

var RegionMatches = React.createFactory(require('./overview/RegionMatches.jsx'));
var RegionWorlds = React.createFactory(require('./overview/RegionWorlds.jsx'));

var worldsStatic = require('gw2w2w-static').worlds;



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
		var lang = this.props.lang;

		var worlds = _.mapValues(worldsStatic, function(world) {
			world[lang.slug].id = world.id;
			world[lang.slug].region = world.region;
			world[lang.slug].link = '/' + lang.slug + '/' + world.slug;
			return world[lang.slug];
		});

		var matches = this.state.matches;

		var regions = [
			{
				"label": "NA",
				"id": "1",
				"matches": _.filter(matches, function(m) {return m.region == 1;}),
			}, {
				"label": "EU",
				"id": "2",
				"matches": _.filter(matches, function(m) {return m.region == 2;}),
			},
		];


		setPageTitle(lang);


		return (
			<div id="overview">
				<div className="row">
					{_.map(regions, function(region){
						return (
							<div className="col-sm-12" key={region.label}>
								<RegionMatches region={region} lang={lang} />
							</div>
						);
					})}
				</div>

				<hr />

				<div className="row">
					{_.map(regions, function(region){
						return (
							<div className="col-sm-12" key={region.label}>
								<RegionWorlds region={region} lang={lang} />
							</div>
						);
					})}
				</div>
			</div>
		);
	},



	getMatches: function() {
		var api = require('../api');
		var component = this;

		api.getMatches(function(err, data) {
			if (!err) {
				component.setState({matches: data});
			}
			
			var interval = _.random(2000, 4000);
			component.updateTimer = setTimeout(component.getMatches, interval);
		});

	},
});


function setPageTitle(lang) {
	var title = ['gw2w2w'];

	if (lang) {
		if (lang.slug !== 'en') {
			title.push(lang.name);
		}
	}
	$('title').text(title.join(' - '));
}