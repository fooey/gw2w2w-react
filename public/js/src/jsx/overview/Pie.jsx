'use strict';


/*
*	Dependencies
*/

var React = require('React');		// browserify shim





/*
*	Component Globals
*/

var pieSize = 60;
var pieStroke = 2;





/*
*	Component Export
*/

module.exports = React.createClass({
	render: render,
	componentDidMount: componentDidMount,
	componentDidUpdate: componentDidMount,

	setImageSrc: setImageSrc,
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

	return (
		(scores && scores.length)
			? <img width='60' height='60' />
			: null

	);
}



function componentDidMount() {
	var component = this;
	var props = component.props;

	var scores = props.scores;

	var src = getImageSource(scores);

	component.setImageSrc(src);
}



function componentDidUpdate() {
	var component = this;
	var props = component.props;

	var scores = props.scores;

	var newImage = new Image(pieSize, pieSize);
	newImage.src = getImageSource(scores);

	newImage.onload = function(){
		component.setImageSrc(newImage.src);
	};
}



/*
*	Component Helpers
*/

function setImageSrc(src) {
	var component = this;

	component.getDOMNode().setAttribute('src', src);
}




/*
*
*	Private Methods
*
*/

function getImageSource(scores) {
	return 'http://www.piely.net/' + pieSize + '/' + scores.join(',') + '?strokeWidth=' + pieStroke;
}
