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
var Objective = require('./Objective.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var mapsStatic = staticData.objective_map;





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
		<div id="guilds">
			{(guilds && guilds.length) ? <hr /> : null }

			{_.map(guilds, function(guild, guildId) {
				return (
					<div key={guild.guild_id} id={guild.guild_id} className="guild">
						<div className="row">
							<div className="col-sm-4">
								<Emblem guildName={guild.guild_name} />
							</div>
							<div className="col-sm-20">
								<h1>{guild.guild_name} [{guild.tag}]</h1>
								<ul className="list-unstyled">
									{_.map(guild.claims, function(entry, ixEntry) {
										return (
											<li key={guild.guild_id + '-' + ixEntry}>
												<Objective
													timeOffset={timeOffset}
													dateNow={dateNow}
													lang={lang}
													entry={entry}
													ixEntry={ixEntry}
												/>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}






/*
*
*	Private Methods
*
*/
