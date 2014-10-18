/**
 * @jxs React.DOM
 */

module.exports = React.createClass({
	render: function() {
		var meta = this.props.objectiveMeta;

		if (meta.d) {
			var src = ['/img/icons/dist/arrow'];

			if (meta.n) {src.push('north'); }
			else if (meta.s) {src.push('south'); }

			if (meta.w) {src.push('west'); }
			else if (meta.e) {src.push('east'); }

			return (
				<span className="direction">
					<img src={src.join('-') + '.svg'} />
				</span>
			);
		}
		else {
			return <span className="direction" />;
		}
	}
});