'use strict';


/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');

// var PureRenderMixin = React.addons.PureRenderMixin;





/*
*	React Components
*/

var Score = require('./Score.jsx');
var Pie = require('./Pie.jsx');





/*
*	Component Globals
*/

var worldsStatic = require('gw2w2w-static').worlds;





/*
*	Component Export
*/

module.exports = React.createClass({
	// mixins: [PureRenderMixin],

	render: render,
	shouldComponentUpdate: shouldComponentUpdate,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var match = props.match;
	var lang = props.lang;

	var matchId = match.id;
	var scores = match.scores;


	var matchWorlds = getMatchWorlds(match, scores, lang);

	return (
		<div className="matchContainer" key={matchId}>
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
									matchId={matchId}
									team={color}
									score={score}
								/>
							</td>
							{(color === 'red')
								? <td rowSpan="3" className="pie">
									<Pie scores={scores} size="60" matchId={matchId} />
								</td>
								: null
							}
						</tr>
					);
				})}
			</table>
		</div>
	);
}



function shouldComponentUpdate(nextProps) {
	var component = this;
	var props = component.props;

	var newScore = !_.isEqual(props.match.scores, nextProps.match.scores);
	var newMatch = (props.match.startTime !== nextProps.match.startTime);

	return (newScore || newMatch);
}





/*
*
*	Private Methods
*
*/
function getMatchWorlds(match, scores, lang) {
	var redWorld = worldsStatic[match.redId][lang.slug];
	var blueWorld = worldsStatic[match.blueId][lang.slug];
	var greenWorld = worldsStatic[match.greenId][lang.slug];

	return  {
		"red": {"world": redWorld, "score": scores[0]},
		"blue": {"world": blueWorld, "score": scores[1]},
		"green": {"world": greenWorld, "score": scores[2]},
	};
}
