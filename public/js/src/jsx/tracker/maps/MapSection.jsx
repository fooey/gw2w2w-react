'use strict';

/*
*
*	Dependencies
*
*/

var React = require('React');	// browserify shim
var _ = require('lodash');



/*
*	React Components
*/

var Objective = require('../objectives/Objective.jsx');





/*
*
*	Module Globals
*
*/

var INSTANCE = {
	objectiveCols: {
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
	}
};





/*
*
*	Component Definition
*
*/

class MapSection extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		var owners = props.details.objectives.owners;
		var claimers = props.details.objectives.claimers;

		return (
			<ul className='list-unstyled'>
				{_.map(props.mapSection.objectives, objectiveId => {

					var owner = owners[objectiveId];
					var claimer = claimers[objectiveId];
					var guildId = (claimer) ? claimer.guild : null;
					var guild = (props.guilds && guildId && props.guilds[guildId]) ? props.guilds[guildId] : null;

					return (
						<li key={objectiveId} id={'objective-' + objectiveId}>
							<Objective
								lang={props.lang}
								cols={INSTANCE.objectiveCols}

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
}



/*
*	Class Properties
*/

MapSection.propTypes = {
	lang: React.PropTypes.object.isRequired,
	mapSection: React.PropTypes.object.isRequired,
	guilds: React.PropTypes.object.isRequired,
	details: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default MapSection;
