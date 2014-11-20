/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');
var moment = require('moment');

var Sprite = React.createFactory(require('../Sprite.jsx'));
var Arrow = React.createFactory(require('../Arrow.jsx'));

var libDate = require('../../../lib/date.js');

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
		var entry = this.props.entry;
		var ixEntry = this.props.ixEntry;
		var guilds = this.props.guilds;
		var matchWorlds = this.props.matchWorlds;
		var mapsMeta = this.props.mapsMeta;


		if (!_.has(objectivesMeta, entry.objectiveId)) {
			// short circuit
			return null;
		}

		var oMeta = objectivesMeta[entry.objectiveId];
		var oName = objectivesNames[entry.objectiveId];
		var oLabel = objectivesLabels[entry.objectiveId];
		var oType = objectivesTypes[oMeta.type];

		var expires = entry.timestamp + (5 * 60);
		var timerActive = (expires >= nowOffset + 5); // show  after expiring
		var secondsRemaining = expires - nowOffset;
		var expiration = moment(secondsRemaining * 1000);

		var timestamp = moment((entry.timestamp + timeOffset) * 1000);


		var className = [
			'objective',
			'team', 
			entry.world,
		].join(' ');

		var mapMeta = mapsMeta[oMeta.map];


		return (
			<div className={className} key={ixEntry}>
				<div className="objective-relative">
					<span>{timestamp.twitterShort()}</span>
				</div>
				<div className="objective-timestamp">
					{timestamp.format('hh:mm:ss')}
				</div>
				<div className="objective-map">
					<span title={mapMeta.name}>{mapMeta.abbr}</span>
				</div>
				<div className="objective-icons">
					<Arrow oMeta={oMeta} />
 					<Sprite type={oType.name} color={entry.world} />
				</div>
				<div className="objective-label">
					<span>{oLabel[lang.slug]}</span>
				</div>
				<div className="objective-guild">
					{renderGuild(entry.guild, guilds)}
				</div>
			</div>
		);
	},
});


function renderGuild(guildId, guilds) {
	if (!guildId) {
		return null;
	}
	else {
		var guild = guilds[guildId];

		var guildClass = [
			'guild',
			'name',
			'pending'
		].join(' ');

		if(!guild) {
			return <span className={guildClass}><i className="fa fa-spinner fa-spin"></i></span>;
		}
		else {
			return <span>
				<a className={guildClass} href={'#' + guildId} title={guild.guild_name}>{guild.guild_name} [{guild.tag}]</a>
			</span>;
		}
	}
}