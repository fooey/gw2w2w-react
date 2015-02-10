'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import _ from 'lodash';
import Immutable from 'Immutable'; // browserify shim



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
	shouldComponentUpdate(nextProps) {
		var props = this.props;

		var newLang = !Immutable.is(props.lang, nextProps.lang);
		var newRegion = !Immutable.is(props.region, nextProps.region);

		var shouldUpdate = newLang || newRegion;

		// console.log('RegionMatches::shouldComponentUpdate()', shouldUpdate);

		return shouldUpdate;
	}



	render() {
		var props = this.props;

		// console.log('RegionMatches::render()');

		return (
			<div className="RegionMatches">
				<h2>{props.region.get("label")}</h2>

				{props.region.get("matches").map(match =>
					<Match
						className='match'
						key={match.get("id")}
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
