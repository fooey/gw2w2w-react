'use strict';


/*
*
*	Dependencies
*
*/

const React		= require('react');
const Immutable	= require('Immutable');




/*
*	Component Globals
*/

const INSTANCE = {
	size	: 60,
	stroke	: 2,
};




/*
*
*	Component Definition
*
*/

const propTypes = {
	scores: React.PropTypes.instanceOf(Immutable.List).isRequired,
};

class Pie extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !Immutable.is(this.props.scores, nextProps.scores);
	}

	render() {
		const props = this.props;

		// console.log('Pie::render', props.scores.toArray());

		return <img
			width={INSTANCE.size}
			height={INSTANCE.size}
			src={getImageSource(props.scores.toArray())}
		/>;
	}
}





/*
*
*	Private Methods
*
*/

function getImageSource(scores) {
	return `http:\/\/www.piely.net\/${INSTANCE.size}\/${scores.join(',')}?strokeWidth=${INSTANCE.stroke}`;
}





/*
*
*	Export Module
*
*/

Pie.propTypes	= propTypes;
module.exports	= Pie;
