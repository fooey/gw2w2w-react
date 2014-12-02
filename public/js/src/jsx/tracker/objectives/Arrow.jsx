'use strict';

/*
*	Dependencies
*/

var React = require('React');	// browserify shim

var PureRenderMixin = React.addons.PureRenderMixin;



/*
*	Component Export
*/

module.exports = React.createClass({
	mixins: [PureRenderMixin],

	render: render,
});






/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	var src = getArrowSrc(props.oMeta);


	return (
		<span className="direction">
			{src ? <img src={src} /> : null}
		</span>
	);
}






/*
*
*	Static Methods
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