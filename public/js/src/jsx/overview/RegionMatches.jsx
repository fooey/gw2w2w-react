/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');

var Match = React.createFactory(require('./Match.jsx'));

module.exports = React.createClass({
	render: function() {
		var region = this.props.region;
		var lang = this.props.lang;

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
});