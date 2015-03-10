'use strict';


/*
*
*	Dependencies
*
*/

const React = require('react');
const Immutable = require('Immutable');



/*
*	React Components
*/

const MatchWorld = require('./MatchWorld');





/*
*
*	Component Export
*
*/

class Match extends React.Component {
	shouldComponentUpdate(nextProps) {
		const newScores = !Immutable.is(this.props.match.get("scores"), nextProps.match.get("scores"));
		const newMatch = !Immutable.is(this.props.match.get("startTime"), nextProps.match.get("startTime"));
		const newWorlds = !Immutable.is(this.props.worlds, nextProps.worlds);
		const shouldUpdate = (newScores || newMatch || newWorlds);

		return shouldUpdate;
	}



	render() {
		const props = this.props;

		// console.log('overview::Match::render()', props.match.toJS());

		const worldColors = ['red', 'blue', 'green'];

		return <div className="matchContainer">
			<table className="match">
				{worldColors.map((color, ixColor) => {
					const worldKey = color + 'Id';
					const worldId = props.match.get(worldKey).toString();
					const world = props.worlds.get(worldId);
					const scores = props.match.get('scores');

					return <MatchWorld
						component='tr'
						key={worldId}

						world={world}
						scores={scores}

						color={color}
						ixColor={ixColor}
						showPie={ixColor === 0}
					/>;
				})}
			</table>
		</div>;
	}
}



/*
*	Class Properties
*/

Match.propTypes = {
	match: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = Match;
