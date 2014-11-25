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

var langs = require('gw2w2w-static').langs;
var worlds = require('gw2w2w-static').worlds;





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
	var world = props.world;

	langs = _.map(langs, function(lang){
		lang.link = '/' + lang.slug;

		if (world) {
			lang.link = lang.link + '/' + world[lang.slug].slug;
		}

		return lang;
	});


	return (
		<ul className="nav navbar-nav">
			{_.map(langs, function(l) {
				return (
					<li key={l.slug} className={(l.slug === lang.slug) ? 'active' : ''} title={l.name}>
						<a data-slug={l.slug} href={l.link}>{l.label}</a>
					</li>
				);
			})}
		</ul>
	);
}