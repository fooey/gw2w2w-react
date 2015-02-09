'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import _ from 'lodash';




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
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		return (
			<img
				width={INSTANCE.size}
				height={INSTANCE.size}
				src={getImageSource(props.scores)}
			/>
		);
	}
}



/*
*	Class Properties
*/

Pie.propTypes = {
	scores: React.PropTypes.array.isRequired,
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
