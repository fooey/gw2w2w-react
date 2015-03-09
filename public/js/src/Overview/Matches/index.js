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

const Match = require('./Match');




/*
*
*	Component Definition
*
*/

class Matches extends React.Component {
	shouldComponentUpdate(nextProps) {
		const props = this.props;

		const newRegion = !Immutable.is(props.region, nextProps.region);
		const newMatches = !Immutable.is(props.matches, nextProps.matches);
		const newWorlds = !Immutable.is(props.worlds, nextProps.worlds);
		const shouldUpdate = (newRegion || newMatches || newWorlds);

		// console.log('overview::Matches::shouldComponentUpdate()', {shouldUpdate, newRegion, newMatches, newWorlds});

		return shouldUpdate;
	}



	render() {
		const props = this.props;

		// console.log('overview::Matches::render()');
		// console.log('overview::Matches::render()', 'region', props.region.toJS());
		// console.log('overview::Matches::render()', 'matches', props.matches.toJS());
		// console.log('overview::Matches::render()', 'worlds', props.worlds);

		return (
			<div className='RegionMatches'>
				<h2>{props.region.get('label')} Matches</h2>

				{props.matches.map((match, matchId) =>
					<Match
						key={matchId}
						className='match'

						worlds={props.worlds}
						match={match}
					/>
				)}
			</div>
		);
	}
}



/*
*	Class Properties
*/

Matches.propTypes = {
	region: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	matches: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = Matches;
