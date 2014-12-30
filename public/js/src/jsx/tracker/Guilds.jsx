'use strict';

/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim





/*
*	React Components
*/

var Guild = require('./guilds/Guild.jsx');





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
	getInitialState: getInitialState,
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

function getInitialState() {
	return {
		animateEntry: false,
	};
}



function render() {
	var component = this;
	var props = component.props;
	var state = component.state;

	var timeOffset = props.timeOffset;
	var dateNow = props.dateNow;
	var lang = props.lang;
	var eventHistory = props.eventHistory;

	var guilds = _
		.chain(props.guilds)
		.map(function(guild){
			guild.claims = _.chain(eventHistory)
				.filter(function(entry){
					return (entry.type === 'claim' && entry.guild === guild.guild_id);
				})
				.sortBy('timestamp')
				.reverse()
				.value();

			guild.lastClaim = (guild.claims && guild.claims.length) ? guild.claims[0].timestamp : 0;
			return guild;
		})
		.sortBy('guild_name')
		.sortBy(function(guild){
			return -guild.lastClaim;
		})
		.value();


	return (
		<section id="guilds">
			<h2 className="section-header">Guild Claims</h2>
			{_.map(guilds, function(guild, ixGuild) {
				var key = guild.guild_id + '@' + guild.lastClaim;

				return (
					<Guild
						{...props}
						key={key}

						animateEntry={state.animateEntry}
						guild={guild}
					/>
				);
			})}
		</section>
	);
}




function componentDidMount() {
	var component = this;

	component.setState({animateEntry: true});
}
