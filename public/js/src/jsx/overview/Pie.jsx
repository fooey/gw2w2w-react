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

	var scores = props.scores;

	return <img width='60' height='60' src={getImageSource(scores)} />;
}




/*
*
*	Private Methods
*
*/

function getImageSource(scores) {
	var pieSize = 60;
	var pieStroke = 2;

	return 'http://www.piely.net/' + pieSize + '/' + scores.join(',') + '?strokeWidth=' + pieStroke;
}
