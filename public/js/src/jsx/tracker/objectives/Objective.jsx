'use strict';

/*
*
*	Dependencies
*
*/

import React from 'React'; 		// browserify shim
import moment from 'moment';	// browserify shim

import _ from 'lodash';

import STATIC from 'gw2w2w-static';



/*
*	React Components
*/

import ObjectiveGuild from './ObjectiveGuild.jsx';

import Sprite from './Sprite.jsx';
import Arrow from './Arrow.jsx';





/*
*
*	Module Globals
*
*/

var INSTANCE = {
	colDefaults: {
		elapsed: false,
		timestamp: false,
		mapAbbrev: false,
		arrow: false,
		sprite: false,
		name: false,
		eventType: false,
		guildName: false,
		guildTag: false,
		timer: false,
	}
};





/*
*
*	Component Definition
*
*/

class Objective extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		var objectiveId = props.objectiveId;

		// short circuit
		if (!_.has(STATIC.objective_meta, objectiveId)) {
			return null;
		}

		// var guildId = props.guildId;
		// var guild = props.guild;

		var cols = _.defaults(props.cols, INSTANCE.colDefaults);


		var expires = props.timestamp + (5 * 60);
		var oMeta = STATIC.objective_meta[objectiveId];
		// var oName = STATIC.objective_names[objectiveId];
		var oLabel = STATIC.objective_labels[objectiveId];
		var oType = STATIC.objective_types[oMeta.type];

		var mapMeta = _.find(STATIC.objective_map, {mapIndex: oMeta.map});

		// console.log(oLabel, oName);

		var className = [
			'objective',
			'team',
			props.worldColor,
		].join(' ');

		var timerClass = [
			'timer',
			'countdown',
			'inactive',
		].join(' ');


		var timestampHtml = moment((props.timestamp) * 1000).format('hh:mm:ss');



		return (
			<div className={className}>
				{(cols.elapsed) ?
					<div className="objective-relative">
						<span className="timer relative" data-timestamp={props.timestamp}>
							<i className="fa fa-spinner fa-spin"></i>
						</span>
					</div>
				: null}
				{(cols.timestamp) ?
					<div className="objective-timestamp">
						{timestampHtml}
					</div>
				: null}
				{(cols.mapAbbrev) ?
					<div className="objective-map">
						<span title={mapMeta.name}>{mapMeta.abbr}</span>
					</div>
				: null}
				{(cols.arrow || cols.sprite) ?
					<div className="objective-icons">
						{(cols.arrow) ?
							<Arrow oMeta={oMeta} />
						: null}
						{(cols.sprite) ?
	 						<Sprite type={oType.name} color={props.worldColor} />
						: null}
					</div>
				: null}
				{(cols.name) ?
					<div className="objective-label">
						<span>{oLabel[props.lang.slug]}</span>
					</div>
				: null}
				{/*(cols.eventType && eventType) ?
					<div className="objective-event">
						<span>{(eventType === 'claim') ? 'Claimed by ' : 'Captured by ' + props.worldColor}</span>
					</div>
				: null*/}
				{(props.guildId || cols.timer) ?
					<div className="objective-state">
						<ObjectiveGuild
							guildId={props.guildId}
							guild={props.guild}
							cols={cols}
						/>
						{(cols.timer) ?
							<span className={timerClass} data-expires={expires}>
								<i className="fa fa-spinner fa-spin"></i>
							</span>
						: null}
					</div>
				: null}
			</div>
		);
	}
}



/*
*	Class Properties
*/

Objective.defaultProps = {
	guildId: null,
	guild: null,
	cols: null,
};

Objective.propTypes = {
	objectiveId: React.PropTypes.number.isRequired,
	lang: React.PropTypes.object.isRequired,
	worldColor: React.PropTypes.string.isRequired,
	timestamp: React.PropTypes.number.isRequired,

	eventType: React.PropTypes.string,
	guildId: React.PropTypes.string,
	guild: React.PropTypes.object,
	cols: React.PropTypes.object,
};




/*
*
*	Export Module
*
*/

export default Objective;
