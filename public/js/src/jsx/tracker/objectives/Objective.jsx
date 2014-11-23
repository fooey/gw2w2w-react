/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');
var moment = require('moment');


var Sprite = require('./Sprite.jsx');
var Arrow = require('./Arrow.jsx');


var staticData = require('gw2w2w-static');
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
	guildName: false,
	guildTag: false,
	timer: false,
};


module.exports = React.createClass({

	render: function() {
		var objectiveId = this.props.objectiveId;

		// short circuit
		if (!_.has(objectivesMeta, objectiveId)) {
			return null;
		}


		var dateNow = this.props.dateNow;
		var timeOffset = this.props.timeOffset;
		var nowOffset = dateNow + timeOffset;


		var lang = this.props.lang;
		var owner = this.props.owner;
		var claimer = this.props.claimer;
		var guild = this.props.guild;

		var cols = _.defaults(this.props.cols, colDefaults);



		var oMeta = objectivesMeta[objectiveId];
		var oName = objectivesNames[objectiveId];
		var oLabel = objectivesLabels[objectiveId];
		var oType = objectivesTypes[oMeta.type];

		var offsetTimestamp = owner.timestamp + timeOffset;
		var expires = offsetTimestamp + (5 * 60);
		var timerActive = (expires >= dateNow + 5); // show for 5 seconds after expiring
		var secondsRemaining = expires - dateNow;
		var expiration = moment(secondsRemaining * 1000);

		var timestamp = moment((owner.timestamp + timeOffset) * 1000);


		// console.log(objective.lastCap, objective.expires, now, objective.expires > now);

		var className = [
			'objective',
			'team',
			owner.world,
		].join(' ');

		var timerClass = [
			'timer',
			(timerActive) ? 'active' : 'inactive',
		].join(' ');

		var timerHtml = (timerActive) ? expiration.format('m:ss') : '0:00';

		return (
			<div className={className}>
				{(cols.elapsed) ?
					<div className="objective-relative">
						<span>{timestamp.twitterShort()}</span>
					</div>
				: null}
				{(cols.timestamp) ?
					<div className="objective-timestamp">
						{timestamp.format('hh:mm:ss')}
					</div>
				: null}
				{(cols.mapAbbrev) ?
					<div className="objective-map">
					</div>
				: null}
				{(cols.arrow || cols.sprite) ?
					<div className="objective-icons">
						{(cols.arrow) ?
							<Arrow oMeta={oMeta} />
						: null}
						{(cols.sprite) ?
	 						<Sprite type={oType.name} color={owner.world} />
						: null}
					</div>
				: null}
				{(cols.name) ?
					<div className="objective-label">
						<span>{oLabel[lang.slug]}</span>
					</div>
				: null}
				{(claimer || cols.timer) ?
					<div className="objective-state">
						{(claimer) ?
							renderGuild(claimer.guild, guild, cols)
						: null}
						{(cols.timer) ?
							<span className={timerClass}>{timerHtml}</span>
						: null}
					</div>
				: null}
			</div>
		);
	},
});

/*
					<span title={mapMeta.name}>{mapMeta.abbr}</span>

*/

function renderGuild(guildId, guild, cols){
	var guildLabel = '';

	if(!guild) {
		guildLabel = <i className="fa fa-spinner fa-spin"></i>;
	}
	else {
		if (cols.guildName) guildLabel += guild.guild_name;
		if (cols.guildTag) guildLabel += guild.tag;
	}

	return <a className="guild" href={'#' + guildId}>{guildLabel}</a>;
}
