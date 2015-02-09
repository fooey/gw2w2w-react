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

class Arrow extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		var imgSrc = getArrowSrc(props.oMeta);


		return (
			<span className="direction">
				{imgSrc ? <img src={imgSrc} /> : null}
			</span>
		);
	}
}



/*
*	Class Properties
*/

Arrow.propTypes = {
	oMeta: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default Arrow;







/*
*
*	Private Methods
*
*/

function getArrowSrc(meta) {
	if (!meta.d) {
		return null;
	}

	var src = ['/img/icons/dist/arrow'];

	if (meta.n) {src.push('north'); }
	else if (meta.s) {src.push('south'); }

	if (meta.w) {src.push('west'); }
	else if (meta.e) {src.push('east'); }

	return src.join('-') + '.svg';
}