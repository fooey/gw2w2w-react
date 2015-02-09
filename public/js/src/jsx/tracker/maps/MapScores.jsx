'use strict';

/*
*
*	Dependencies
*
*/

import React from 'React';		// browserify shim
import numeral from 'numeral';	// browserify shim

import _ from 'lodash';




/*
*	React Components
*/





/*
*
*	Component Definition
*
*/

class MapScores extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		return (
			<ul className="list-inline">
				{_.map(props.scores, (score, ixScore) => {
					let formatted = numeral(score).format('0,0');
					let team = ['red', 'blue', 'green'][ixScore];

					return <li key={team} className={`team ${team}`}>{formatted}</li>;
				})}
			</ul>
		);
	}
}



/*
*	Class Properties
*/

MapScores.propTypes = {
	scores: React.PropTypes.array.isRequired,
};




/*
*
*	Export Module
*
*/

export default MapScores;
