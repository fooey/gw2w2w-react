/**
 * @jxs React.DOM
 */

var worldsStatic = require('gw2w2w-static').worlds;


module.exports = React.createClass({
	render: function() {
		var lang = window.app.state.lang;
		var langSlug = lang.slug;

		var label = this.props.region.label;
		var regionId = this.props.region.regionId;

		var worlds = _.chain(worldsStatic)
			.filter(function(world) {return world.region == regionId;})
			.map(function(world) {
				world[langSlug].id = world.id;
				world[langSlug].link = '/' + langSlug + '/' + world.slug;
				return world[langSlug];
			})
			.sortBy('name')
			.value();

		return (
			<div className="RegionWorlds">
				<h2>{label}</h2>
				<ul className="list-unstyled">
					{_.map(worlds, function(world){
						return (
							<li key={'world' + world.id}>
								<a href={world.slug}>
									{world.name}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
});