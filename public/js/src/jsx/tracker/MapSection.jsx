/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');


var MapObjective = React.createFactory(require('./MapObjective.jsx'));


module.exports = React.createClass({

	render: function() {

		var dateNow = this.props.dateNow;
		var timeOffset = this.props.timeOffset;
		var lang = this.props.lang;
		var mapSection = this.props.mapSection;
		var owners = this.props.owners;
		var claimers = this.props.claimers;
		var guilds = this.props.guilds;

		return (
			<ul className='list-unstyled'>
				{_.map(mapSection.objectives, function(objectiveId) {

					var owner = owners[objectiveId];
					var claimer = claimers[objectiveId];
					// var claimer = (claimer && guilds[guildId]) ? guilds[guildId] : null;

					return (
						<li key={objectiveId} id={'objective-' + objectiveId}>
							<MapObjective
								dateNow={dateNow}
								timeOffset={timeOffset}
								lang={lang}
								objectiveId={objectiveId}
								owner={owner}
								claimer={claimer}
								guilds={guilds}
							/>
						</li>
					);

				})}
			</ul>
		);
	},
});