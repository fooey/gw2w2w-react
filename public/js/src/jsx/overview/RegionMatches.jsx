'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import _ from 'lodash';



/*
*	React Components
*/

import Match from './Match.jsx';




/*
*
*	Component Definition
*
*/

class RegionMatches extends React.Component {
	render() {
		var props = this.props;

		var matches = _.sortBy(props.region.matches, 'id');

		return (
			<div className="RegionMatches">
				<h2>{props.region.label}</h2>

				{_.map(matches, match =>
					<Match
						className='match'
						key={match.id}
						match={match}
						lang={props.lang}
					/>
				)}
			</div>
		);
	}
}



/*
*	Class Properties
*/

RegionMatches.propTypes = {
	lang: React.PropTypes.object.isRequired,
	region: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default RegionMatches;
