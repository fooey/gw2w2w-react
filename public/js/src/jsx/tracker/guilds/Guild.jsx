'use strict';

/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim





/*
*	React Components
*/

var Emblem = require('./Emblem.jsx');
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
	guildName: false,
	guildTag: false,
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

	var guild = props.guild;
	var timeOffset = props.timeOffset;
	var dateNow = props.dateNow;
	var lang = props.lang;


	return (
		<div className="guild" id={guild.guild_id}>
			<div className="row">

				<div className="col-sm-4">
					<Emblem guildName={guild.guild_name} />
				</div>

				<div className="col-sm-20">
					<h1>{guild.guild_name} [{guild.tag}]</h1>

					<ul className="list-unstyled">
						{_.map(guild.claims, function(entry, ixEntry) {
							return (
								<li key={entry.id}>
									<Objective
										lang={lang}
										cols={objectiveCols}

										objectiveId={entry.objectiveId}
										worldColor={entry.world}
										timestamp={entry.timestamp}
										guildId={guild.guild_id}
										guild={guild}
									/>
								</li>
							);
						})}
					</ul>

				</div>

			</div>
		</div>
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
