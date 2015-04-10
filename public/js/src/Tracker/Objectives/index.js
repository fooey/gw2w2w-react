'use strict';

/*
*
*	Dependencies
*
*/

const React		= require('react');
const Immutable	= require('Immutable');

const _			= require('lodash');

const STATIC	= require('lib/static');



/*
*	React Components
*/

const TimerRelative		= require('./TimerRelative');
const Timestamp			= require('./Timestamp');
const MapName			= require('./MapName');
const Icons				= require('./Icons');
const Label				= require('./Label');
const Guild				= require('./Guild');
const TimerCountdown	= require('./TimerCountdown');





/*
*
*	Module Globals
*
*/

const colDefaults = {
	elapsed		: false,
	timestamp	: false,
	mapAbbrev	: false,
	arrow		: false,
	sprite		: false,
	name		: false,
	eventType	: false,
	guildName	: false,
	guildTag	: false,
	timer		: false,
};





/*
*
*	Component Definition
*
*/

const propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,

	objectiveId: React.PropTypes.number.isRequired,
	worldColor: React.PropTypes.string.isRequired,
	timestamp: React.PropTypes.number.isRequired,
	eventType: React.PropTypes.string,

	guildId: React.PropTypes.string,
	guild: React.PropTypes.instanceOf(Immutable.Map),

	cols: React.PropTypes.object,
};

class Objective extends React.Component {
	shouldComponentUpdate(nextProps) {
		const newLang		= !Immutable.is(this.props.lang, nextProps.lang);
		const newCapture	= !Immutable.is(this.props.timestamp, nextProps.timestamp);
		const newOwner		= !Immutable.is(this.props.worldColor, nextProps.worldColor);
		const newClaimer	= !Immutable.is(this.props.guildId, nextProps.guildId);
		const newGuildData	= !Immutable.is(this.props.guild, nextProps.guild);

		const shouldUpdate	= (newLang || newCapture || newOwner || newClaimer || newGuildData);

		return shouldUpdate;
	}



	render() {
		const props = this.props;
		// console.log('Objective:render()', this.props.objectiveId);

		const objectiveId	= this.props.objectiveId.toString();
		const oMeta			= STATIC.objective_meta.get(objectiveId);

		// short circuit
		if (oMeta.isEmpty()) {
			return null;
		}

		const cols = _.defaults(this.props.cols, colDefaults);


		return (
			<div className = {`objective team ${this.props.worldColor}`}>
				<TimerRelative isEnabled = {!!cols.elapsed} timestamp = {props.timestamp} />
				<Timestamp isEnabled = {!!cols.timestamp} timestamp = {props.timestamp} />
				<MapName isEnabled = {!!cols.mapAbbrev} objectiveId = {objectiveId} />

				<Icons
					showArrow	= {!!cols.arrow}
					showSprite	= {!!cols.sprite}
					objectiveId	= {objectiveId}
					color		= {this.props.worldColor}
				/>

				<Label isEnabled = {!!cols.name} objectiveId = {objectiveId} lang = {this.props.lang} />

				<div className="objective-state">
					<Guild
						showName	= {cols.guildName}
						showTag		= {cols.guildTag}
						guildId		= {this.props.guildId}
						guild		= {this.props.guild}
					/>

					<TimerCountdown isEnabled = {!!cols.timer} timestamp = {props.timestamp} />
				</div>
			</div>
		);
	}
}




/*
*
*	Export Module
*
*/

Objective.propTypes	= propTypes;
module.exports		= Objective;
