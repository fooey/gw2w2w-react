/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');

var worldsStatic = require('gw2w2w-static').worlds;


var Score = React.createFactory(require('./Score.jsx'));
var Pie = React.createFactory(require('./Pie.jsx'));

module.exports = React.createClass({
	render: function() {
		var match = this.props.match;
		var lang = this.props.lang;

		var scores = match.scores;

		var redWorld = worldsStatic[match.redId][lang.slug];
		var blueWorld = worldsStatic[match.blueId][lang.slug];
		var greenWorld = worldsStatic[match.greenId][lang.slug];

		var matchWorlds = {
			"red": {"world": redWorld, "score": scores[0]},
			"blue": {"world": blueWorld, "score": scores[1]},
			"green": {"world": greenWorld, "score": scores[2]},
		};

		return (
			<div className="matchContainer" key={match.id}>
				<table className="match">
					{_.map(matchWorlds, function(mw, color) {
						var world = mw.world;
						var score = mw.score;

						var href = ['', lang.slug, world.slug].join('/');
						var label = world.name;

						return (
							<tr key={color}>
								<td className={"team name " + color}>
									<a href={href}>{label}</a>
								</td>
								<td className={"team score " + color}>
									<Score 
										key={match.id}
										matchId={match.id}
										team={color}
										score={score} 
									/>
								</td>
								{(color === 'red') ?
									<td rowSpan="3" className="pie"><Pie scores={match.scores} size="60" matchId={match.id} /></td> :
									null
								}
							</tr>
						);
					})}
				</table>
			</div>
		);
	},
});