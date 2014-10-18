/**
 * @jxs React.DOM
 */

module.exports = React.createClass({

	componentDidMount: function() {
	},

	componentDidUpdate: function(prevProps, prevState){
		// console.log('Score::componentWillUpdate', prevProps, this.props);

		if (_.isNumber(this.props.diff) && this.props.diff > 0) {
			var $diff = $('.diff', this.getDOMNode());

			// $diff
			// 	.fadeIn('fast')
			// 	.delay(2000)
			// 	.fadeOut('slow');
			$diff
				.velocity('fadeOut', {duration: 0})
				.velocity('fadeIn', {duration: 400})
				.velocity('fadeOut', {duration: 2000, delay: 4000});
		}
	},

	render: function() {
		var matchId = this.props.matchId;
		var team = this.props.team;
		var score = this.props.score || 0;
		var diff = this.props.diff || 0;

		return (
			<span>
				{(diff) ?
					<span className="diff">{numeral(diff).format('0,0')}</span>
					: <span />
				}
				<span className="value">{numeral(score).format('0,0')}</span>
			</span>
		);
	}
});