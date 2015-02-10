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
*	Component Globals
*/

var INSTANCE = {
	size: 60,
	stroke: 2,
};




/*
*
*	Component Definition
*
*/

class Pie extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !Immutable.is(this.props.scores, nextProps.scores);
	}

	render() {
		var props = this.props;

		return <img
			width={INSTANCE.size}
			height={INSTANCE.size}
			src={getImageSource(props.scores.toArray())}
		/>;
	}
}



/*
*	Class Properties
*/

Pie.propTypes = {
	scores: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default Pie;




/*
*
*	Private Methods
*
*/

function getImageSource(scores) {
	return `http:\/\/www.piely.net\/${INSTANCE.size}\/${scores.join(',')}?strokeWidth=${INSTANCE.stroke}`;
}
