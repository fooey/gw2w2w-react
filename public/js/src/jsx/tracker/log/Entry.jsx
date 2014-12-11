'use strict';

/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim
var $ = require('jquery');		// browserify shim





/*
*	React Components
*/

var Objective = require('../objectives/Objective.jsx');





/*
*	Component Globals
*/

var objectiveCols = {
	elapsed: true,
	timestamp: true,
	mapAbbrev: true,
	arrow: true,
	sprite: true,
	name: true,
	eventType: false,
	guildName: true,
	guildTag: true,
	timer: false,
};





/*
*	Component Export
*/

module.exports = React.createClass({
	render: render,
	componentDidMount: componentDidMount,
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

	var lang = props.lang;
	var cols = props.objectiveCols;

	var animateEntry = props.animateEntry;
	var entryId = props.entryId;
	var objectiveId = props.objectiveId;
	var worldColor = props.worldColor;
	var timestamp = props.timestamp;
	var guildId = props.guildId;
	var eventType = props.eventType;
	var guild = props.guild;

	return (
		<li>
			<Objective
				lang={lang}
				cols={objectiveCols}

				objectiveId={objectiveId}
				worldColor={worldColor}
				timestamp={timestamp}
				guildId={guildId}
				eventType={eventType}
				guild={guild}
			/>
		</li>
	);
}




function componentDidMount() {
	var component = this;
	var props = component.props;

	if (props.animateEntry) {
		var $node = $(component.getDOMNode());

		$node
			.velocity('slideUp', {duration: 0})
			.velocity('slideDown', {duration: 800});
	}
}

