'use strict';


/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim





/*
*	React Components
*/

var Match = require('./Match.jsx');




/*
*	Component Export
*/

module.exports = React.createClass({
	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var region = props.region;
	var lang = props.lang;

	return (
		<div className="RegionMatches">
			<h2>{region.label}</h2>
			{_.map(region.matches, function(match){
				return (
					<Match
						key={match.id}
						className="match"
						match={match}
						lang={lang}
					/>
				);
			})}
		</div>
	);
}