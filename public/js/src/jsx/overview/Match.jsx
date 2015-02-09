'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import _ from 'lodash';

import STATIC from 'gw2w2w-static';



/*
*	React Components
*/

import Score from './Score.jsx';
import Pie from './Pie.jsx';





/*
*
*	Component Export
*
*/

class Match extends React.Component {
	shouldComponentUpdate(nextProps) {
		var props = this.props;

		var newScore = !_.isEqual(props.match.scores, nextProps.match.scores);
		var newMatch = (props.match.startTime !== nextProps.match.startTime);
		var newLang = (props.lang.slug !== nextProps.lang.slug);

		return (newScore || newMatch || newLang);
	}



	render() {
		var props = this.props;

		var matchWorlds = getMatchWorlds(props.match, props.lang);

		return (
			<div className="matchContainer" key={props.match.matchId}>
				<table className="match">
					{_.map(matchWorlds, (mw, color) => {
						let world = mw.world;
						let score = mw.score;

						let href = ['', props.lang.slug, world.slug].join('/');
						let label = world.name;

						return (
							<tr key={color}>
								<td className={"team name " + color}>
									<a href={href}>{label}</a>
								</td>
								<td className={"team score " + color}>
									<Score
										matchId={props.match.matchId}
										team={color}
										score={score}
									/>
								</td>
								{(color === 'red')
									? <td rowSpan="3" className="pie">
										<Pie
											scores={props.match.scores}
											size="60"
										/>
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
}



/*
*	Class Properties
*/

Match.propTypes = {
	lang: React.PropTypes.object.isRequired,
	match: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default Match;



/*
*
*	Private Methods
*
*/

function getMatchWorlds(match, lang) {
	var redWorld = STATIC.worlds[match.redId][lang.slug];
	var blueWorld = STATIC.worlds[match.blueId][lang.slug];
	var greenWorld = STATIC.worlds[match.greenId][lang.slug];

	return  {
		"red": {"world": redWorld, "score": match.scores[0]},
		"blue": {"world": blueWorld, "score": match.scores[1]},
		"green": {"world": greenWorld, "score": match.scores[2]},
	};
}
