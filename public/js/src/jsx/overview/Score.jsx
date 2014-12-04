'use strict';


/*
*	Dependencies
*/

var React = require('React');		// browserify shim
var _ = require('lodash');			// browserify shim
var $ = require('jquery');			// browserify shim
var numeral = require('numeral');	// browserify shim





/*
*	Component Export
*/

module.exports = React.createClass({
	getInitialState: getInitialState,
	render: render,
	componentWillReceiveProps: componentWillReceiveProps,
	shouldComponentUpdate: shouldComponentUpdate,
	componentDidUpdate: componentDidUpdate,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function getInitialState() {
	return {diff: 0};
}



function componentWillReceiveProps(nextProps){
	var component = this;
	var props = component.props;

	// console.log('Score::componentWillReceiveProps', nextProps.score, props.score);
	component.setState({diff: nextProps.score - props.score});
}



function render() {
	var component = this;
	var props = component.props;
	var state = component.state;

	var matchId = props.matchId;
	var team = props.team;
	var score = props.score || 0;

	return (
		<div>
			<span className="diff">{
				(state.diff) ?
					'+' + numeral(state.diff).format('0,0') :
					null
			}</span>
			<span className="value">{numeral(score).format('0,0')}</span>
		</div>
	);
}



function shouldComponentUpdate(nextProps) {
	var component = this;
	var props = component.props;

	var newScore = (props.score !== nextProps.score);

	return newScore;
}




function componentDidUpdate() {
	var component = this;
	var state = component.state;

	if(state.diff > 0) {
		var $diff = $('.diff', component.getDOMNode());

		$diff
			.velocity('fadeOut', {duration: 0})
			.velocity('fadeIn', {duration: 200})
			.velocity('fadeOut', {duration: 1200, delay: 400});
	}
}
