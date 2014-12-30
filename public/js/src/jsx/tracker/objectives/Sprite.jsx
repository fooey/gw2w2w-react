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

	var type = props.type;
	var color = props.color;

	var className = ['sprite', type, color].join(' ');

	return (
		<span className={className} />
	);
}