
var Sprite = React.createFactory(require('./Sprite.jsx'));
var staticData = require('gw2w2w-static');
var objectiveTypes = staticData.objective_types;

var colors = ['red', 'blue', 'green'];
var colorMap = {"red": 0, "green": 1, "blue": 2};

module.exports = React.createClass({

	componentDidMount: function() {
	},

	render: function() {
		var lang = window.app.state.lang;
		var langSlug = lang.slug;

		var match = this.props.match;
		var scores = _.map(match.scores, function(score){return numeral(score).format('0,0'); });
		var ticks = match.ticks;
		var holdings = match.holdings;
		var matchWorlds = this.props.matchWorlds;

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

								<h1>{matchWorlds[scoreIndex].name}</h1>
								<h2>{score} +{ticks[scoreIndex]}</h2>

								<ul className="list-inline">
									{_.map(holdings[scoreIndex], function(holding, ixHolding) {
										var oType = objectiveTypes[ixHolding + 1];

										return (
											<li key={ixHolding}>
												<Sprite type={oType.name} color={colors[scoreIndex]} /> x {holding}
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

/*


								<ul className="list-inline">
									{_.map(holdings, function(holding, ixHolding) {
										var ot = objectiveTypes[ixHolding + 1];

										return (
											<li key={'type-holdings-' + ot.name}>
												<Sprite type={ot.name} color={colors[scoreIndex]} /> x {ot.holdings[scoreIndex]}
											</li>
										);
									})}
								</ul>
*/