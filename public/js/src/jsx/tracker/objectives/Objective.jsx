'use strict';

/*
*	Dependencies
*/

var React = require('React');		// browserify shim
var _ = require('lodash');			// browserify shim
var moment = require('moment');		// browserify shim





/*
*	React Components
*/

var Sprite = require('./Sprite.jsx');
var Arrow = require('./Arrow.jsx');

var PureRenderMixin = React.addons.PureRenderMixin;





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var mapsStatic = staticData.objective_map;
var objectivesNames = staticData.objective_names;
var objectivesTypes = staticData.objective_types;
var objectivesMeta = staticData.objective_meta;
var objectivesLabels = staticData.objective_labels;

var colDefaults = {
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
};





/*
*	Component Export
*/

module.exports = React.createClass({
	mixins: [PureRenderMixin],

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

	var objectiveId = props.objectiveId;

	// short circuit
	if (!_.has(objectivesMeta, objectiveId)) {
		return null;
	}

	var lang = props.lang;
	var worldColor = props.worldColor;
	var timestamp = props.timestamp;
	var guildId = props.guildId;
	var guild = props.guild;
	var eventType = props.eventType || null;

	var cols = _.defaults(props.cols, colDefaults);


	var expires = timestamp + (5 * 60);
	var oMeta = objectivesMeta[objectiveId];
	var oName = objectivesNames[objectiveId];
	var oLabel = objectivesLabels[objectiveId];
	var oType = objectivesTypes[oMeta.type];

	var mapMeta = _.find(mapsStatic, {mapIndex: oMeta.map});

	// console.log(oLabel, oName);

	var className = [
		'objective',
		'team',
		worldColor,
	].join(' ');

	var timerClass = [
		'timer',
		'countdown',
		'inactive',
	].join(' ');


	var timestampHtml = moment((timestamp) * 1000).format('hh:mm:ss');



	return (
		<div className={className}>
			{(cols.elapsed) ?
				<div className="objective-relative">
					<span className="timer relative" data-timestamp={timestamp}>
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
 						<Sprite type={oType.name} color={worldColor} />
					: null}
				</div>
			: null}
			{(cols.name) ?
				<div className="objective-label">
					<span>{oLabel[lang.slug]}</span>
				</div>
			: null}
			{/*(cols.eventType && eventType) ?
				<div className="objective-event">
					<span>{(eventType === 'claim') ? 'Claimed by ' : 'Captured by ' + worldColor}</span>
				</div>
			: null*/}
			{(guildId || cols.timer) ?
				<div className="objective-state">
					{(guildId && (cols.guildName || cols.guildTag)) ?
						renderGuild(guildId, guild, cols)
					: null}
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





/*
*
*	Private Methods
*
*/

function renderGuild(guildId, guild, cols){
	var guildLabel = '';

	if(!guild) {
		guildLabel = <i className="fa fa-spinner fa-spin"></i>;
	}
	else {
		if (cols.guildName) {
			guildLabel += guild.guild_name;
		}
		if (cols.guildTag) {
			if (cols.guildName) {
				guildLabel += (' [' + guild.tag + ']');
			}
			else {
				guildLabel += guild.tag;
			}
		}
	}

	return (
		<span>
			<a 	className="guildname"
				href={'#' + guildId}
				title={guild ? guild.guild_name + ' [' + guild.tag + ']' : null}>

				{guildLabel}

			</a>
		</span>
	);
}
