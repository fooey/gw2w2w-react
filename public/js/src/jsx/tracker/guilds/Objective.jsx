/**
 * @jsx React.DOM
 */
var Sprite = require('../Sprite.jsx');
var Arrow = require('../Arrow.jsx');

module.exports = React.createClass({

	render: function() {
		var staticData = require('../../../staticData');
		var objectivesData = staticData.objectives;

		var appState = window.app.state;

		var objective = this.props.objective;
		var objectives = this.props.objectives;


		if (!objectivesData.objective_meta[objective.id]) {
			console.log(objective.id, 'not in', objectivesData.objective_meta);
			// short circuit
			return null;
		}


		// var objective = objectives[objective];
		var objectiveMeta = objectivesData.objective_meta[objective.id];
		var objectiveName = objectivesData.objective_names[objective.id];
		var objectiveLabels = objectivesData.objective_labels[objective.id];
		var objectiveType = objectivesData.objective_types[objectiveMeta.type];

		var className = [
			'objective',
			'team', 
			objective.owner.toLowerCase(),
		].join(' ');

		return (
			<div className={className}>
				<div className="objective-icons">
					<Arrow objectiveMeta={objectiveMeta} />
 					<Sprite type={objectiveType.name} color={objective.owner.toLowerCase()} />
				</div>
				<div className="objective-timestamp">
					{moment(objective.lastCap * 1000).format('hh:mm:ss')}
				</div>
				<div className="objective-label">
					<span>{objectiveLabels[appState.lang.slug]}</span>
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