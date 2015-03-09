'use strict';

/*
*
*	Dependencies
*
*/

const React = require('react');
const Immutable = require('Immutable');

const numeral = require('numeral');




/*
*	React Components
*/





/*
*
*	Component Definition
*
*/

class MapScores extends React.Component {
	shouldComponentUpdate(nextProps) {
		const newScores = !Immutable.is(this.props.scores, nextProps.scores);

		const shouldUpdate = (newScores);

		return shouldUpdate;
	}



	render() {
		const props = this.props;

		return (
			<ul className="list-inline">
				{props.scores.map((score, ixScore) => {
					const formatted = numeral(score).format('0,0');
					const team = ['red', 'blue', 'green'][ixScore];

					return <li key={team} className={`team ${team}`}>
						{formatted}
					</li>;
				})}
			</ul>
		);
	}
}



/*
*	Class Properties
*/

MapScores.propTypes = {
	scores: React.PropTypes.instanceOf(Immutable.List).isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = MapScores;
