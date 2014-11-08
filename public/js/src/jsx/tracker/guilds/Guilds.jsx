/**
 * @jsx React.DOM
 */

//var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Objective = React.createFactory(require('./Objective.jsx'));

module.exports = React.createClass({

	render: function() {
		var dateNow = this.props.dateNow;
		var eventHistory = this.props.eventHistory;
		var mapsMeta = this.props.mapsMeta;

		var guilds = _
			.chain(this.props.guilds)
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


		var guildsList = _.map(guilds, function(guild, guildId) {
			return (
				<div key={guild.guild_id} id={guild.guild_id} className="guild">
					<div className="row">
						<div className="col-sm-4">
							<img className="emblem" src={getEmblemSrc(guild.guild_name)} />
						</div>
						<div className="col-sm-20">
							<h1>{guild.guild_name} [{guild.tag}]</h1>
							<ul className="list-unstyled">
								{_.map(guild.claims, function(entry, ixEntry) {
									return (
										<li key={guild.guild_id + '-' + ixEntry}>
											<Objective
												entry={entry}
												ixEntry={ixEntry}
												mapsMeta={mapsMeta}
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
			<div className="list-unstyled" id="guilds">
				{guildsList}
			</div>
		);
	},
});

function getEmblemSrc(guildName) {
	return 'http://guilds.gw2w2w.com/guilds/' + encodeURIComponent(guildName.replace(/ /g, '-')) + '/64.svg';
}


/*
											<Objective
												claim={claim}
												objectives={objectives}
												guilds={guilds}
											/>
*/