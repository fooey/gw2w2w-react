'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React';		// browserify shim
import $ from 'jquery';			// browserify shim
import numeral from 'numeral';	// browserify shim

import Immutable from 'Immutable'; // browserify shim




/*
*
*	Component Definition
*
*/

class Score extends React.Component {
	constructor(props) {
		super(props);
		this.state = {diff: 0};
	}



	shouldComponentUpdate(nextProps) {
		return !Immutable.is(this.props.score, nextProps.score);
	}



	componentWillReceiveProps(nextProps){
		var props = this.props;

		this.setState({diff: nextProps.score - props.score});
	}



	componentDidUpdate() {
		var state = this.state;

		if(state.diff !== 0) {
			animateScoreDiff(this.refs.diff.getDOMNode());
		}
	}


	render() {
		var props = this.props;
		var state = this.state;

		return <div>
			<span className="diff" ref="diff">{getDiffText(state.diff)}</span>
			<span className="value">{getScoreText(props.score)}</span>
		</div>;
	}
}



/*
*	Class Properties
*/

Score.propTypes = {
	score: React.PropTypes.number.isRequired,
};




/*
*
*	Export Module
*
*/

export default Score;





/*
*
*	Private Methods
*
*/

function animateScoreDiff(el) {
	$(el)
		.velocity('fadeOut', {duration: 0})
		.velocity('fadeIn', {duration: 200})
		.velocity('fadeOut', {duration: 1200, delay: 400});
}


function getDiffText(diff) {
	return (diff)
		? numeral(diff).format('+0,0')
		: null;
}


function getScoreText(score) {
	return (score)
		? numeral(score).format('0,0')
		: null;
}