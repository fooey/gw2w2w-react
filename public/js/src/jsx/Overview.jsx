'use strict';


/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim

var api = require('../api');





/*
*	React Components
*/

var RegionMatches = require('./overview/RegionMatches.jsx');
var RegionWorlds = require('./overview/RegionWorlds.jsx');





/*
*	Component Globals
*/

var worldsStatic = require('gw2w2w-static').worlds;





/*
*	Component Export
*/

module.exports = React.createClass({
	getInitialState: getInitialState,
	// componentWillMount: componentWillMount,
	componentDidMount: componentDidMount,
	componentWillUnmount: componentWillUnmount,
	render: render,

	getMatches: getMatches,
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
	return {matches: {}};
}



function render() {
	var component = this;
	var props = component.props;
	var state = component.state;

	var lang = props.lang;

	var worlds = _.mapValues(worldsStatic, function(world) {
		world[lang.slug].id = world.id;
		world[lang.slug].region = world.region;
		world[lang.slug].link = '/' + lang.slug + '/' + world.slug;
		return world[lang.slug];
	});

	var matches = state.matches;

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
}



function componentDidMount() {
	var component = this;

	component.updateTimer = null;
	component.getMatches();
}



function componentWillUnmount() {
	var component = this;

	clearTimeout(component.updateTimer);
}




/*
*	Component Helper Methods
*/

function getMatches() {
	var component = this;

	api.getMatches(function(err, data) {
		if(component.isMounted()) {
			if (!err && data && Object.keys(data).length) {
				component.setState({matches: data});
			}

			var interval = _.random(2000, 4000);
			component.updateTimer = window.setTimeout(component.getMatches, interval);
		}
	});
}





/*
*
*	Private Methods
*
*/

function setPageTitle(lang) {
	var title = ['gw2w2w'];

	if (lang) {
		if (lang.slug !== 'en') {
			title.push(lang.name);
		}
	}

	document.getElementsByTagName('title')[0].innerHTML = title.join(' - ');
}
