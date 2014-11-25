'use strict';

/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim
var moment = require('moment');	// browserify shim





/*
*	React Components
*/

var Sprite = require('../objectives/Sprite.jsx');
var Arrow = require('../objectives/Arrow.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var mapsStatic = staticData.objective_map;
var objectivesNames = staticData.objective_names;
var objectivesTypes = staticData.objective_types;
var objectivesMeta = staticData.objective_meta;
var objectivesLabels = staticData.objective_labels;





/*
*	Component Export
*/

module.exports = React.createClass({
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

	var timeOffset = props.timeOffset;
	var lang = props.lang;
	var entry = props.entry;
	var ixEntry = props.ixEntry;
	var guilds = props.guilds;
	var mapsMeta = props.mapsMeta;


	if (!_.has(objectivesMeta, entry.objectiveId)) {
		// short circuit
		return null;
	}

	var oMeta = objectivesMeta[entry.objectiveId];
	var oName = objectivesNames[entry.objectiveId];
	var oLabel = objectivesLabels[entry.objectiveId];
	var oType = objectivesTypes[oMeta.type];

	var timestamp = moment((entry.timestamp + timeOffset) * 1000);


	var mapMeta = _.find(mapsStatic, {mapIndex: oMeta.map});


	var className = [
		'objective',
		'team',
		entry.world,
	].join(' ');



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
}