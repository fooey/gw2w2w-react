'use strict';


/*
*
*	Dependencies
*
*/

const React = require('react');

const $ = require('jQuery');
const numeral = require('numeral');





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
		return (this.props.score !== nextProps.score);
	}



	componentWillReceiveProps(nextProps){
		const props = this.props;

		this.setState({diff: nextProps.score - props.score});
	}



	componentDidUpdate() {
		const state = this.state;

		if(state.diff !== 0) {
			animateScoreDiff(this.refs.diff.getDOMNode());
		}
	}


	render() {
		const props = this.props;
		const state = this.state;

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

module.exports = Score;





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