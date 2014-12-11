'use strict';

/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim





/*
*	React Components
*/

var Objective = require('../objectives/Objective.jsx');





/*
*	Component Globals
*/

var objectiveCols = {
	elapsed: false,
	timestamp: false,
	mapAbbrev: false,
	arrow: true,
	sprite: true,
	name: true,
	eventType: false,
	guildName: false,
	guildTag: true,
	timer: true,
};





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

	var lang = props.lang;
	var mapSection = props.mapSection;
	var owners = props.owners;
	var claimers = props.claimers;
	var guilds = props.guilds;
	var mapMeta = props.mapMeta;

	return (
		<ul className='list-unstyled'>
			{_.map(mapSection.objectives, function(objectiveId) {

				var owner = owners[objectiveId];
				var claimer = claimers[objectiveId];
				var guildId = (claimer) ? claimer.guild : null;
				var guild = (guilds && guildId && guilds[guildId]) ? guilds[guildId] : null;

				return (
					<li key={objectiveId} id={'objective-' + objectiveId}>
						<Objective
							lang={lang}
							cols={objectiveCols}

							objectiveId={objectiveId}
							worldColor={owner.world}
							timestamp={owner.timestamp}
							guildId={guildId}
							guild={guild}
						/>
					</li>
				);

			})}
		</ul>
	);
}