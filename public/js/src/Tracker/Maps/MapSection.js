'use strict';

/*
*
*	Dependencies
*
*/

const React		= require('react');
const Immutable	= require('Immutable');



/*
*	React Components
*/

const Objective	= require('Tracker/Objectives');





/*
*
*	Module Globals
*
*/

const objectiveCols = {
	elapsed		: false,
	timestamp	: false,
	mapAbbrev	: false,
	arrow		: true,
	sprite		: true,
	name		: true,
	eventType	: false,
	guildName	: false,
	guildTag	: true,
	timer		: true,
};





/*
*
*	Component Definition
*
*/

const propTypes = {
	lang		: React.PropTypes.object.isRequired,
	mapSection	: React.PropTypes.object.isRequired,
	guilds		: React.PropTypes.object.isRequired,
	details		: React.PropTypes.object.isRequired,
};

class MapSection extends React.Component {
	shouldComponentUpdate(nextProps) {
		const newLang		= !Immutable.is(this.props.lang, nextProps.lang);
		const newGuilds		= !Immutable.is(this.props.guilds, nextProps.guilds);
		const newDetails	= !Immutable.is(this.props.details, nextProps.details);

		const shouldUpdate	= (newLang || newGuilds || newDetails);

		return shouldUpdate;
	}

	render() {
		const mapObjectives	= this.props.mapSection.get('objectives');
		const owners		= this.props.details.getIn(['objectives', 'owners']);
		const claimers		= this.props.details.getIn(['objectives', 'claimers']);
		const sectionClass	= getSectionClass(this.props.mapMeta.get('key'), this.props.mapSection.get('label'));


		return (
			<ul className={`list-unstyled ${sectionClass}`}>
				{mapObjectives.map(objectiveId => {
					const owner		= owners.get(objectiveId.toString());
					const claimer	= claimers.get(objectiveId.toString());

					const guildId		= (claimer) ? claimer.guild : null;
					const hasClaimer	= !!guildId;

					const hasGuildData	= hasClaimer && this.props.guilds.has(guildId);
					const guild			= hasGuildData ? this.props.guilds.get(guildId) : null;

					return (
						<li key={objectiveId} id={'objective-' + objectiveId}>
							<Objective
								lang		= {this.props.lang}
								cols		= {objectiveCols}

								objectiveId	= {objectiveId}
								worldColor	= {owner.get('world')}
								timestamp	= {owner.get('timestamp')}
								guildId		= {guildId}
								guild		= {guild}
							/>
						</li>
					);

				})}
			</ul>
		);
	}
}





/*
*
*	Private Methods
*
*/

function getSectionClass(mapKey, sectionLabel) {
	let sectionClass = [
		'col-md-24',
		'map-section',
	];

	if (mapKey === 'Center') {
		if (sectionLabel === 'Castle') {
			sectionClass.push('col-sm-24');
		}
		else {
			sectionClass.push('col-sm-8');
		}
	}
	else {
		sectionClass.push('col-sm-8');
	}

	return sectionClass.join(' ');
}





/*
*
*	Export Module
*
*/

MapSection.propTypes	= propTypes;
module.exports			= MapSection;
