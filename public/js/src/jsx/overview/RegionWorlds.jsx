/**
 * @jxs React.DOM
 */


module.exports = React.createClass({
	render: function() {
		var label = this.props.data.label;
		var worlds = _.sortBy(this.props.data.worlds, 'name');

		return (
			<div className="RegionWorlds">
				<h2>{label}</h2>
				<ul className="list-unstyled">
					{_.map(worlds, function(world){
						return (
							<li key={'world' + world.id}><a href={world.link}>{world.name}</a></li>
						);
					})}
				</ul>
			</div>
		);
	}
});