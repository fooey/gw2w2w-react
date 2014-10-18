/**
 * @jxs React.DOM
 */

var Sprite = require('./Sprite.jsx');

module.exports = React.createClass({

	componentDidMount: function() {
	},

	render: function() {
		var matchDetails = this.props.matchDetails;
		var worlds = this.props.matchWorlds;

		var scores = this.props.scores;
		var objectives = this.props.objectives;

		var staticData = require('../../staticData');
		var objectiveTypes = staticData.objectives.objective_types;
		var objectivesMeta = staticData.objectives.objective_meta;

		_.map(objectiveTypes, function(ot) {
			if (ot && ot.value > 0) {
				ot.holdings = [0,0,0];
			}
		});

		var colors = ['red', 'blue', 'green'];
		var colorMap = {"red": 0, "green": 1, "blue": 2};

		// var objectives = matchDetails.maps && _.reduce(matchDetails.maps, function(acc, mapData) {
		// 	return acc.concat(mapData.objectives);
		// }, []);

		_.each(objectives, function(os) {
			var oMeta = objectivesMeta[os.id];
			var oType = oMeta && objectiveTypes[oMeta.type];

			if (oType) {
				var color = os.owner.toLowerCase();
				var colorIndex = colorMap[color];

				oType.holdings[colorIndex]++;
			}

		});

		var tick = _.reduce(objectiveTypes, function(acc, ot) {
			if (ot && ot.value) {
				acc[0] += (ot.holdings[0] * ot.value);
				acc[1] += (ot.holdings[1] * ot.value);
				acc[2] += (ot.holdings[2] * ot.value);
			}
			return acc;
		}, [0,0,0]);


		return (
			<div className="row" id="scoreboards">{
				_.map(scores, function(score, scoreIndex) {

					var scoreboardClass = [
						'scoreboard',
						'team-bg',
						'team',
						'text-center',
						colors[scoreIndex]
					].join(' ');

					return (
						<div className="col-sm-8" key={'total-score-' + scoreIndex}>
							<div className={scoreboardClass}>
								<h1>{worlds[scoreIndex].name}</h1>
								<h2>
									{numeral(score).format('0,0')} +{numeral(tick[scoreIndex]).format('0,0')}
								</h2>

								<ul className="list-inline">
									{_.map(objectiveTypes, function(ot) {
										if(ot === null || ot.value === 0) return null;

										return (
											<li key={'type-holdings-' + ot.name}>
												<Sprite type={ot.name} color={colors[scoreIndex]} /> x {ot.holdings[scoreIndex]}
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					);
				})
			}</div>
		);
	}
});