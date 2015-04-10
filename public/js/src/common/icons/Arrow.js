'use strict';

/*
*
*	Dependencies
*
*/

const React		= require('react');
const Immutable	= require('Immutable');





/*
*
*	Component Definition
*
*/

const propTypes = {
	oMeta: React.PropTypes.object.isRequired,
};

class Arrow extends React.Component {
	shouldComponentUpdate(nextProps) {
		const newObjectiveMeta	= !Immutable.is(this.props.oMeta, nextProps.oMeta);
		const shouldUpdate		= (newObjectiveMeta);

		return shouldUpdate;
	}

	render() {
		const imgSrc = getArrowSrc(this.props.oMeta);

		return (
			<span className="direction">
				{imgSrc ? <img src={imgSrc} /> : null}
			</span>
		);
	}
}






/*
*
*	Private Methods
*
*/

function getArrowSrc(meta) {
	if (!meta.get('d')) {
		return null;
	}

	let src = ['/img/icons/dist/arrow'];

	if (meta.get('n')) 		{src.push('north'); }
	else if (meta.get('s'))	{src.push('south'); }

	if (meta.get('w'))		{src.push('west'); }
	else if (meta.get('e'))	{src.push('east'); }

	return src.join('-') + '.svg';
}




/*
*
*	Export Module
*
*/

Arrow.propTypes	= propTypes;
module.exports	= Arrow;
