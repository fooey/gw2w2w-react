'use strict';


/*
*	Dependencies
*/

var React = require('React');		// browserify shim

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

	var size = props.size || '60';
	var stroke = props.stroke || 2;
	var scores = props.scores || [];

	var pieSrc = 'http://www.piely.net/' + size + '/' + scores.join(',') + '?strokeWidth=' + stroke;

	return (
		(scores.length) ?
			<img
				width="60" height="60"
				key={'pie-' + props.matchId}
				src={pieSrc}
			/> :
			<span />
	);
}