/**
 * @jxs React.DOM
 */

module.exports = React.createClass({

	render: function() {
		var type = this.props.type;
		var color = this.props.color;

		return (
			<span className={['sprite', type, color].join(' ')} />
		);
	}
});