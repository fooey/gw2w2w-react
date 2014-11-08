/*jslint node: true */
"use strict";

var React = require('React');


var Score = React.createFactory(require('./Score.jsx'));
var Pie = React.createFactory(require('./Pie.jsx'));

var worldsStatic = require('gw2w2w-static').worlds;

module.exports = React.createClass({
	render: function() {
		// console.log('Match:render', this.props.match.id);
		var lang = window.app.state.lang;
		var langSlug = lang.slug;

		var match = this.props.match;

		var redWorld = worldsStatic[match.redId][langSlug];
		var blueWorld = worldsStatic[match.blueId][langSlug];
		var greenWorld = worldsStatic[match.greenId][langSlug];

		[redWorld, blueWorld, greenWorld].map(function(world) {
			world.link = '/' + langSlug + '/' + world.slug;
			return world;
		});

		return (
			<div className="matchContainer" key={match.id}>
				<table className="match">
					<tr>
						<td className="team red name"><a href={redWorld.link}>{redWorld.name}</a></td>
						<td className="team red score">
							<Score 
								key={'red-score-' + match.id}
								matchId={match.id}
								team="red"
								score={match.scores[0]} 
							/>
						</td>
						<td rowSpan="3" className="pie">
							<Pie scores={match.scores} size="60" matchId={match.id} />
						</td>
					</tr>
					<tr>
						<td className="team blue name"><a href={blueWorld.link}>{blueWorld.name}</a></td>
						<td className="team blue score">
							<Score 
								key={'blue-score-' + match.id}
								matchId={match.id}
								team="blue"
								score={match.scores[1]} 
							/>
						</td>
					</tr>
					<tr>
						<td className="team green name"><a href={greenWorld.link}>{greenWorld.name}</a></td>
						<td className="team green score">
							<Score 
								key={'green-score-' + match.id}
								matchId={match.id}
								team="green"
								score={match.scores[2]} 
							/>
						</td>
					</tr>
				</table>
			</div>
		);
	},
});