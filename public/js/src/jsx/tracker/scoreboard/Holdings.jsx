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


import HoldingsItem from './HoldingsItem.jsx';




/*
*
*	Component Definition
*
*/

class Holdings extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		return <ul className="list-inline">
			{_.map(props.holdings, (typeQuantity, typeIndex) =>
				<HoldingsItem
					key={typeIndex}
					color={props.color}
					typeQuantity={typeQuantity}
					typeIndex={typeIndex}
				/>
			)}
		</ul>;
	}
}



/*
*	Class Properties
*/

Holdings.propTypes = {
	color: React.PropTypes.string.isRequired,
	holdings: React.PropTypes.array.isRequired,
};




/*
*
*	Export Module
*
*/

export default Holdings;
