/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');


var Objective = require('./objectives/Objective.jsx');

var objectiveCols = {
	elapsed: false,
	timestamp: false,
	mapAbbrev: false,
	arrow: true,
	sprite: true,
	name: true,
	guildName: false,
	guildTag: true,
	timer: true,
};


module.exports = React.createClass({

	render: function() {

		var dateNow = this.props.dateNow;
		var timeOffset = this.props.timeOffset;
		var lang = this.props.lang;
		var mapSection = this.props.mapSection;
		var owners = this.props.owners;
		var claimers = this.props.claimers;
		var guilds = this.props.guilds;
		var mapsMeta = this.props.mapsMeta;

		return (
			<ul className='list-unstyled'>
				{_.map(mapSection.objectives, function(objectiveId) {

					var owner = owners[objectiveId];
					var claimer = claimers[objectiveId];
					var guild = (claimer && guilds[claimer.guild]) ? guilds[claimer.guild] : null;

					return (
						<li key={objectiveId} id={'objective-' + objectiveId}>
							<Objective
								dateNow={dateNow}
								timeOffset={timeOffset}
								cols={objectiveCols}
								lang={lang}

								objectiveId={objectiveId}
								owner={owner}
								claimer={claimer}
								guild={guild}
								mapsMeta={mapsMeta}
							/>
						</li>
					);

				})}
			</ul>
		);
	},
});