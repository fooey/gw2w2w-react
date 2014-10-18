/**
 * @jxs React.DOM
 */

module.exports = React.createClass({
	render: function() {
		var size = this.props.size || '60';
		var stroke = this.props.stroke || 2;
		var scores = this.props.scores || [];

		var pieSrc = 'http://www.piely.net/' + size + '/' + scores.join(',') + '?strokeWidth=' + stroke;

		return (
			(scores.length) ?
				<img
					width="60" height="60"
					key={'pie-' + this.props.matchId}
					src={pieSrc}
				/> :
				<span />
		);
	}
});