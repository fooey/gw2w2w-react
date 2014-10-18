/**
 * @jsx React.DOM
 */
var Sprite = require('./Sprite.jsx');
var Arrow = require('./Arrow.jsx');

module.exports = React.createClass({

	render: function() {
		var staticData = require('../../staticData');
		var objectivesData = staticData.objectives;

		var appState = window.app.state;

		var objectiveId = this.props.objectiveId;
		var dateNow = this.props.dateNow;
		var objectives = this.props.objectives;
		var guilds = this.props.guilds;


		if (!_.has(objectivesData.objective_meta, objectiveId)) {
			// short circuit
			return null;
		}


		var objective = objectives[objectiveId];
		var objectiveMeta = objectivesData.objective_meta[objective.id];
		var objectiveName = objectivesData.objective_names[objective.id];
		var objectiveLabels = objectivesData.objective_labels[objective.id];
		var objectiveType = objectivesData.objective_types[objectiveMeta.type];

		var timerActive = (objective.expires >= dateNow + 5); // show for 5 seconds after expiring
		var timerUnknown = (objective.lastCap === window.app.state.start);
		var secondsRemaining = objective.expires - dateNow;
		var expiration = moment(secondsRemaining * 1000);


		// console.log(objective.lastCap, objective.expires, now, objective.expires > now);

		var className = [
			'objective',
			'team', 
			objective.owner.toLowerCase(),
		].join(' ');

		var timerClass = [
			'timer',
			(timerActive) ? 'active' : 'inactive',
			(timerUnknown) ? 'unknown' : '',
		].join(' ');

		var tagClass = [
			'tag',
		].join(' ');

		var timerHtml = (timerActive) ? expiration.format('m:ss') : '0:00';

		return (
			<div className={className}>
				<div className="objective-icons">
					<Arrow objectiveMeta={objectiveMeta} />
 					<Sprite type={objectiveType.name} color={objective.owner.toLowerCase()} />
				</div>
				<div className="objective-label">
					<span>{objectiveLabels[appState.lang.slug]}</span>
				</div>
				<div className="objective-state">
					{function(){
						var guildId = objective.owner_guild;

						if (!guildId) {
							return null;
						}
						else {
							var guild = guilds[guildId];

							var guildClass = [
								'guild',
								'tag',
								'pending'
							].join(' ');

							if(!guild) {
								return <span className={guildClass}><i className="fa fa-spinner fa-spin"></i>;</span>;
							}
							else {
	 							return <a className={guildClass} title={guild.guild_name}>{guild.tag}</a>;
							}
						}
					}()}
					<span className={timerClass} title={'Expires at ' + objective.expires}>{timerHtml}</span>
				</div>
			</div>
		);
	},
});


function getArrow(meta) {
	if (!meta.d) {
		return null;
	}
	else {
		var src = ['/img/icons/dist/arrow'];

		if (meta.n) {src.push('north'); }
		else if (meta.s) {src.push('south'); }

		if (meta.w) {src.push('west'); }
		else if (meta.e) {src.push('east'); }

		return <img src={src.join('-') + '.svg'} />;

	}
}


/*

													<div>
														<div>now: {now}</div>
														<div>cap: {objective.lastCap}</div>
														<div>exp: {objective.expires}</div>
													</div>
													<div>
														<div> {objective.lastCap.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {objective.expires.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {objective.expires.diff(now, 's')}</div>
													</div>
*/