'use strict';


/*
*
*	Dependencies
*
*/

const React		= require('react');
const Immutable	= require('Immutable');


/*
*	React Components
*/

const Item		= require('./Item');




/*
*
*	Component Definition
*
*/

const propTypes = {
	color	: React.PropTypes.string.isRequired,
	holdings: React.PropTypes.instanceOf(Immutable.List).isRequired,
};

class Holdings extends React.Component {
	shouldComponentUpdate(nextProps) {
		const newHoldings	= !Immutable.is(this.props.holdings, nextProps.holdings);
		const shouldUpdate	= (newHoldings);

		return shouldUpdate;
	}



	render() {
		return <ul className="list-inline">
			{this.props.holdings.map((typeQuantity, typeIndex) =>
				<Item
					key				= {typeIndex}
					color			= {this.props.color}
					typeQuantity	= {typeQuantity}
					typeId			= {(typeIndex+1).toString()}
				/>
			)}
		</ul>;
	}
}




/*
*
*	Export Module
*
*/

Holdings.propTypes	= propTypes;
module.exports		= Holdings;
