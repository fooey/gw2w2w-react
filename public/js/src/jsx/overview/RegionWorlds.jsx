'use strict';


/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim

var PureRenderMixin = React.addons.PureRenderMixin;





/*
*	Component Globals
*/

var worldsStatic = require('gw2w2w-static').worlds;





/*
*	Component Export
*/

module.exports = React.createClass({
	mixins: [PureRenderMixin],

	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/


function render() {
	var component = this;
	var props = component.props;

	var lang = props.lang;
	var region = props.region;

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