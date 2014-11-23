/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');
var moment = require('moment');


var Sprite = require('../objectives/Sprite.jsx');
var Arrow = require('../objectives/Arrow.jsx');


var staticData = require('gw2w2w-static');
var objectivesNames = staticData.objective_names;
var objectivesTypes = staticData.objective_types;
var objectivesMeta = staticData.objective_meta;
var objectivesLabels = staticData.objective_labels;


module.exports = React.createClass({
	render: function() {
		var timeOffset = this.props.timeOffset;
		var lang = this.props.lang;
		var entry = this.props.entry;
		var ixEntry = this.props.ixEntry;
		var guilds = this.props.guilds;
		var mapsMeta = this.props.mapsMeta;


		if (!_.has(objectivesMeta, entry.objectiveId)) {
			// short circuit
			return null;
		}

		var oMeta = objectivesMeta[entry.objectiveId];
		var oName = objectivesNames[entry.objectiveId];
		var oLabel = objectivesLabels[entry.objectiveId];
		var oType = objectivesTypes[oMeta.type];

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
			</div>
		);
	},
});