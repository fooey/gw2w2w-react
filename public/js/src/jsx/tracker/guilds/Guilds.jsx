/**
 * @jsx React.DOM
 */
var Objective = require('./Objective.jsx');

module.exports = React.createClass({

	render: function() {
		var objectives = this.props.objectives;

		var guilds = _
			.chain(this.props.guilds)
			.sortBy('guild_name')
			.sortBy(function(guild){
				return -_.max(guild.objectives, 'lastCap');
			})
			.value();

		return (
			<div id="guilds">
				{_.map(guilds, function(guild, guildId) {
					var emblemSrc = 'http://guilds.gw2w2w.com/guilds/' + encodeURIComponent(guild.guild_name.replace(/ /g, '-')) + '/64.svg';
					return (
						<div key={'guild-' + guildId} id={'guild-' + guildId} className="row">
							<div className="col-sm-4">
								<img className="emblem" src={emblemSrc} />
							</div>
							<div className="col-sm-20">
								<h1>{guild.guild_name} [{guild.tag}]</h1>
								<ul className="list-unstyled">
									{_.map(guild.objectives, function(objective) {
										return (
											<li key={'objective-' + objective.id}>
												<Objective
													objective={objective}
													objectives={objectives}
													guilds={guilds}
												/>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					);
				})}
			</div>
		);
	},
});
