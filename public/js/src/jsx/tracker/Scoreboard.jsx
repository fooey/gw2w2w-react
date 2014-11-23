/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');
var numeral = require('numeral');

var Sprite = require('./objectives/Sprite.jsx');
var staticData = require('gw2w2w-static');
var objectiveTypes = staticData.objective_types;

module.exports = React.createClass({

	render: function() {
		var lang = this.props.lang;
		var matchWorlds = this.props.matchWorlds;

		return (
			<div className="row" id="scoreboards">{
				_.map(matchWorlds, function(mw, color) {
					var world = mw.world;
					var score = mw.score;
					var tick = mw.tick;
					var holdings = mw.holding;

					var scoreboardClass = [
						'scoreboard',
						'team-bg',
						'team',
						'text-center',
						color
					].join(' ');

					return (
						<div className="col-sm-8" key={color}>
							<div className={scoreboardClass}>

								<h1>{world.name}</h1>
								<h2>{numeral(score).format('0,0')} +{tick}</h2>

								<ul className="list-inline">
									{_.map(holdings, function(holding, ixHolding) {
										var oType = objectiveTypes[ixHolding + 1];

										return (
											<li key={ixHolding}>
												<Sprite type={oType.name} color={color} /> x {holding}
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