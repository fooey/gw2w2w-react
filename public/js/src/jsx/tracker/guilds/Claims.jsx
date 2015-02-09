'use strict';

/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import _ from 'lodash';



/*
*	React Components
*/

import Objective from '../objectives/Objective.jsx';





/*
*	Component Globals
*/

var objectiveCols = {
	elapsed: true,
	timestamp: true,
	mapAbbrev: true,
	arrow: true,
	sprite: true,
	name: true,
	eventType: false,
	guildName: false,
	guildTag: false,
	timer: false,
};




/*
*
*	Component Definition
*
*/

class GuildClaims extends React.Component {
	render() {
		var props = this.props;

		return (
			<ul className="list-unstyled">
				{_.map(props.guild.claims, entry =>
					<li key={entry.id}>
						<Objective
							cols={objectiveCols}

							lang={props.lang}
							guildId={props.guild.guild_id}
							guild={props.guild}

							objectiveId={entry.objectiveId}
							worldColor={entry.world}
							timestamp={entry.timestamp}
						/>
					</li>
				)}
			</ul>
		);
	}

}



/*
*	Class Properties
*/

GuildClaims.propTypes = {
	lang: React.PropTypes.object.isRequired,
	guild: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default GuildClaims;


