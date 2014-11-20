/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');

var worldsStatic = require('gw2w2w-static').worlds;

module.exports = React.createClass({
	render: function() {
		var lang = this.props.lang;
		var region = this.props.region;

		var label = region.label + ' Worlds';
		var regionId = region.id;

		var worlds = _.chain(worldsStatic)
			.filter(function(w){return w.region == regionId;})
			.sortBy(function(w){return w[lang.slug].name;})
			.value();

		return (
			<div className="RegionWorlds">
				<h2>{label}</h2>
				<ul className="list-unstyled">
					{_.map(worlds, function(world){
						var href = ['', lang.slug, world[lang.slug].slug].join('/');
						var label = world[lang.slug].name;
						
						return (
							<li key={world.id}>
								<a href={href}>{label}</a>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
});