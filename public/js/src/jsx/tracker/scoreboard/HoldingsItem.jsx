'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim

import _ from 'lodash';

import STATIC from 'gw2w2w-static';





/*
*	React Components
*/

import Sprite from '../objectives/Sprite.jsx';




/*
*
*	Component Definition
*
*/

class HoldingsItem extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		var oType = STATIC.objective_types[props.typeIndex + 1];

		return (
			<li>
				<Sprite type={oType.name} color={props.color} />
				{` x${props.typeQuantity}`}
			</li>
		);
	}
}



/*
*	Class Properties
*/

HoldingsItem.propTypes = {
	color: React.PropTypes.string.isRequired,
	typeQuantity: React.PropTypes.number.isRequired,
	typeIndex: React.PropTypes.number.isRequired,
};




/*
*
*	Export Module
*
*/

export default HoldingsItem;