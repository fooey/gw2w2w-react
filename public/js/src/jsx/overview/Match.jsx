'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import _ from 'lodash';
import Immutable from 'Immutable'; // browserify shim


import STATIC from '../../lib/static';



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

		var newLang = !Immutable.is(props.lang, nextProps.lang);
		var newScores = !Immutable.is(props.match.get("scores"), nextProps.match.get("scores"));

		var shouldUpdate = newLang || newScores;

		return shouldUpdate;
	}



	render() {
		var props = this.props;

		// console.log('Match::render()', props.match.get("id"));

		var matchWorlds = getMatchWorlds(props.match, props.lang);

		return <div className="matchContainer" key={props.match.get("id")}>
			<table className="match">
				{matchWorlds.map((mw, color) => {
					let world = mw.world;
					let score = mw.score;

					let href = ['', props.lang.slug, world.slug].join('/');
					let label = world.name;

					return <tr key={color}>
						<td className={`team name ${color}`}>
							<a href={href}>{label}</a>
						</td>
						<td className={`team score ${color}`}>
							<Score team={color} score={score} />
						</td>
						{(color === 'red')
							? <td rowSpan="3" className="pie">
								<Pie scores={props.match.get("scores")} size={60} />
							</td>
							: null
						}
					</tr>;
				})}
			</table>
		</div>;
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
	var redWorld = STATIC.worlds.get(match.get("redId").toString())[lang.slug];
	var blueWorld = STATIC.worlds.get(match.get("blueId").toString())[lang.slug];
	var greenWorld = STATIC.worlds.get(match.get("greenId").toString())[lang.slug];

	return Immutable.Map({
		"red": {"world": redWorld, "score": match.get("scores").get(0)},
		"blue": {"world": blueWorld, "score": match.get("scores").get(1)},
		"green": {"world": greenWorld, "score": match.get("scores").get(2)},
	});
}
