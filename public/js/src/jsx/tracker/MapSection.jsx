/**
 * @jsx React.DOM
 */

var MapObjective = React.createFactory(require('./MapObjective.jsx'));
// var staticData = require('gw2w2w-static');

module.exports = React.createClass({

	render: function() {

		var dateNow = this.props.dateNow;
		var mapSection = this.props.mapSection;
		var owners = this.props.owners;
		var claimers = this.props.claimers;
		var guilds = this.props.guilds;

		return (
			<ul className='list-unstyled'>
				{_.map(mapSection.objectives, function(objectiveId) {

					var owner = owners[objectiveId];
					var claimer = claimers[objectiveId];
					// var claimer = (claimer && guilds[guildId]) ? guilds[guildId] : null;

					return (
						<li key={objectiveId} id={'objective-' + objectiveId}>
							<MapObjective
								dateNow={dateNow}
								objectiveId={objectiveId}
								owner={owner}
								claimer={claimer}
								guilds={guilds}
							/>
						</li>
					);

				})}
			</ul>
		);
	},
});


/*

													<div>
														<div>now: {now}</div>
														<div>cap: {o.lastCap}</div>
														<div>exp: {o.expires}</div>
													</div>
													<div>
														<div> {o.lastCap.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {o.expires.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {o.expires.diff(now, 's')}</div>
													</div>
*/