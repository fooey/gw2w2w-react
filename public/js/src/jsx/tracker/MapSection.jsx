/**
 * @jsx React.DOM
 */

var MapObjective = require('./MapObjective.jsx');

module.exports = React.createClass({

	render: function() {
		var staticData = require('../../staticData');

		var mapSection = this.props.mapSection;
		var objectives = this.props.objectives;
		var guilds = this.props.guilds;
		var dateNow = this.props.dateNow;

		return (
			<ul className='list-unstyled'>
				{_.map(mapSection.objectives, function(objectiveId) {
					return (
						<li key={'objective-' + objectiveId} id={'objective-' + objectiveId}>
							<MapObjective
								objectiveId={objectiveId}
								dateNow={dateNow}
								objectives={objectives}
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