/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');
var moment = require('moment');

 
var Sprite = React.createFactory(require('./Sprite.jsx'));
var Arrow = React.createFactory(require('./Arrow.jsx'));

var staticData = require('gw2w2w-static');
var objectivesNames = staticData.objective_names;
var objectivesTypes = staticData.objective_types;
var objectivesMeta = staticData.objective_meta;
var objectivesLabels = staticData.objective_labels;

module.exports = React.createClass({

	render: function() {
		var dateNow = this.props.dateNow;
		var timeOffset = this.props.timeOffset;
		var nowOffset = dateNow + timeOffset;


		var lang = this.props.lang;
		var objectiveId = this.props.objectiveId;
		var owner = this.props.owner;
		var claimer = this.props.claimer;
		var guilds = this.props.guilds;


		if (!_.has(objectivesMeta, objectiveId)) {
			// short circuit
			return null;
		}

		var oMeta = objectivesMeta[objectiveId];
		var oName = objectivesNames[objectiveId];
		var oLabel = objectivesLabels[objectiveId];
		var oType = objectivesTypes[oMeta.type];

		var offsetTimestamp = owner.timestamp + timeOffset;
		var expires = offsetTimestamp + (5 * 60);
		var timerActive = (expires >= dateNow + 5); // show for 5 seconds after expiring
		var secondsRemaining = expires - dateNow;
		var expiration = moment(secondsRemaining * 1000);


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

		var tagClass = [
			'tag',
		].join(' ');

		var timerHtml = (timerActive) ? expiration.format('m:ss') : '0:00';

		return (
			<div className={className}>
				<div className="objective-icons">
					<Arrow oMeta={oMeta} />
 					<Sprite type={oType.name} color={owner.world} />
				</div>
				<div className="objective-label">
					<span>{oLabel[lang.slug]}</span>
				</div>
				<div className="objective-state">
					{renderGuild(claimer, guilds)}
					<span className={timerClass}>{timerHtml}</span>
				</div>
			</div>
		);
	},
});

function renderGuild(claimer, guilds){
	if (!claimer) {
		return null;
	}
	else {
		var guild = guilds[claimer.guild];

		var guildClass = [
			'guild',
			'tag',
			'pending'
		].join(' ');

		if(!guild) {
			return <span className={guildClass}><i className="fa fa-spinner fa-spin"></i></span>;
		}
		else {
			return <a className={guildClass} href={'#' + claimer.guild} title={guild.guild_name}>{guild.tag}</a>;
		}
	}
}