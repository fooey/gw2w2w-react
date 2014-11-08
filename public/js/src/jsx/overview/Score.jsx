/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');
var $ = require('jquery');
var numeral = require('numeral');


module.exports = React.createClass({
	getInitialState: function() {
		return {diff: 0};
	},

	componentWillReceiveProps: function(nextProps){
		// console.log('Score::componentWillReceiveProps', nextProps.score, this.props.score);
		this.setState({diff: nextProps.score - this.props.score});
	},

	componentDidUpdate: function() {
		if(this.state.diff > 0) {
			var $diff = $('.diff', this.getDOMNode());

			// $diff
			// 	.hide()
			// 	.fadeIn(400)
			// 	.delay(4000)
			// 	.fadeOut(2000);
			$diff
				.velocity('fadeOut', {duration: 0})
				.velocity('fadeIn', {duration: 200})
				.velocity('fadeOut', {duration: 1200, delay: 400});
		}
	},

	render: function() {
		var matchId = this.props.matchId;
		var team = this.props.team;
		var score = this.props.score || 0;

		return (
			<span>
				<span className="diff">{
					(this.state.diff) ?
						'+' + numeral(this.state.diff).format('0,0') :
						null
				}</span>
				<span className="value">{numeral(score).format('0,0')}</span>
			</span>
		);
	}
});