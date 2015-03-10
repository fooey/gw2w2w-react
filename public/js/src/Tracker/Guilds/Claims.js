'use strict';

/*
*
*	Dependencies
*
*/

const React = require('react');
const Immutable = require('Immutable');



/*
*	React Components
*/

const Objective = require('../Objectives');





/*
*	Component Globals
*/

const objectiveCols = {
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
	shouldComponentUpdate(nextProps) {
		const newLang = !Immutable.is(this.props.lang, nextProps.lang);
		const newClaims = !Immutable.is(this.props.guild.get('claims'), nextProps.guild.get('claims'));

		const shouldUpdate = (newLang || newClaims);
		// console.log('Claims::shouldComponentUpdate()', shouldUpdate, this.props.guild.get('guild_id'));

		return shouldUpdate;
	}



	render() {
		const guildId = this.props.guild.get('guild_id');
		const claims = this.props.guild.get('claims');

		// console.log('Claims::render()', guildId);


		return (
			<ul className="list-unstyled">
				{claims.map(entry =>
					<li key={entry.get('id')}>
						<Objective
							cols={objectiveCols}

							lang={this.props.lang}
							guildId={guildId}
							guild={this.props.guild}

							objectiveId={entry.get('objectiveId')}
							worldColor={entry.get('world')}
							timestamp={entry.get('timestamp')}
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
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	guild: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = GuildClaims;

