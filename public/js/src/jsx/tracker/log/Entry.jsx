'use strict';

/*
*
*	Dependencies
*
*/

var React = require('React'); // browserify shim
// var _ = require('lodash');

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
*
*	Component Definition
*
*/

class Entry extends React.Component {
	render() {
		var props = this.props;

		return (
			<li>
				<Objective
					{...props}

					cols={objectiveCols}

					entryId={props.entry.id}
					objectiveId={props.entry.objectiveId}
					worldColor={props.entry.world}
					timestamp={props.entry.timestamp}
					eventType={props.entry.type}
					guildId={props.entry.guild}
				/>
			</li>
		);
	}



	componentDidMount() {
		var props = this.props;

		if (props.triggerNotification) {
			props.libAudio.playAlert(
				props.options.audio,
				props.lang,
				props.entry.objectiveId,
				props.entry.type,
				props.entry.world
			);

			var $node = $(React.findDOMNode(this));

			$node
				.velocity('slideUp', {duration: 0})
				.velocity('slideDown', {duration: 800});
		}
	}
}



/*
*	Class Properties
*/

Entry.defaultProps = {
	guilds: {},
};

Entry.propTypes = {
	lang: React.PropTypes.object.isRequired,
	triggerNotification: React.PropTypes.bool.isRequired,
	libAudio: React.PropTypes.object.isRequired,
	options: React.PropTypes.object.isRequired,
	entry: React.PropTypes.object.isRequired,
	guilds: React.PropTypes.object.isRequired,
	// guild: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default Entry;
