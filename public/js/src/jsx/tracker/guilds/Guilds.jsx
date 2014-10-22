/**
 * @jsx React.DOM
 */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Objective = require('./Objective.jsx');

module.exports = React.createClass({

	render: function() {
		var claimsLog = this.props.claimsLog;
		var objectives = this.props.objectives;

		var guilds = _
			.chain(this.props.guilds)
			.map(function(guild){
				guild.claims = _.filter(claimsLog, function(entry){
					return (entry.objective.owner_guild === guild.guild_id);
				});
				guild.claims = _.sortBy(guild.claims, 'timestamp').reverse();
				guild.lastClaim = guild.claims[0].timestamp;
				return guild;
			})
			.sortBy('guild_name')
			.sortBy(function(guild){
				return -guild.lastClaim;
			})
			.value();


		var guildsList = _.map(guilds, function(guild, guildId) {
			return (
				<div key={'guild-' + guild.guild_id} id={'guild-' + guild.guild_id} className="transition guild">
					<div className="row">
						<div className="col-sm-4">
							<img className="emblem" src={getEmblemSrc(guild.guild_name)} />
						</div>
						<div className="col-sm-20">
							<h1>{guild.guild_name} [{guild.tag}]</h1>
							<ul className="list-unstyled">
								{_.map(guild.claims, function(claim) {
									return (
										<li key={'objective-' + claim.objective.id}>
											<Objective
												claim={claim}
												objectives={objectives}
												guilds={guilds}
											/>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</div>
			);
		});


		return (
			<ReactCSSTransitionGroup transitionName="guild" component={React.DOM.div} className="list-unstyled" id="guilds">
				{guildsList}
			</ReactCSSTransitionGroup>
		);
	},
});

function getEmblemSrc(guildName) {
	return 'http://guilds.gw2w2w.com/guilds/' + encodeURIComponent(guildName.replace(/ /g, '-')) + '/64.svg';
}
