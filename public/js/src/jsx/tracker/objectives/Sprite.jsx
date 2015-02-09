'use strict';

/*
*
*	Dependencies
*
*/

import React from 'React'; 		// browserify shim

import _ from 'lodash';





/*
*
*	Component Definition
*
*/

class Sprite extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

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

export default Sprite;
