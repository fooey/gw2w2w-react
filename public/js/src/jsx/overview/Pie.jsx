'use strict';


/*
*	Dependencies
*/

var React = require('React');		// browserify shim





/*
*	Component Export
*/

module.exports = React.createClass({
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
