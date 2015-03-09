'use strict';

/*
*
*	Dependencies
*
*/

const React = require('react');

const _ = require('lodash');





/*
*
*	Component Definition
*
*/

class Sprite extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		const props = this.props;

		return <span className={`sprite ${props.type} ${props.color}`} />;
	}
}



/*
*	Class Properties
*/

Sprite.propTypes = {
	type: React.PropTypes.string.isRequired,
	color: React.PropTypes.string.isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = Sprite;
