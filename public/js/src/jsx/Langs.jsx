/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');

var langs = require('gw2w2w-static').langs;
var worlds = require('gw2w2w-static').worlds;

module.exports = React.createClass({	
	render: function() {
		var langSlug = this.props.langSlug;
		var worldSlug = this.props.worldSlug;

		if (worldSlug) {
			var world = _.find(worlds, function(world) {
				return world[langSlug].slug === worldSlug;
			});
		}

		langs = _.map(langs, function(lang){
			lang.link = '/' + lang.slug;

			if (world) {
				lang.link = lang.link + '/' + world[lang.slug].slug;
			} 

			return lang;
		});


		return (
			<ul className="nav navbar-nav">
				{_.map(langs, function(lang) {
					return (
						<li key={lang.slug} className={(lang.slug === langSlug) ? 'active' : ''} title={lang.name}>
							<a data-slug={lang.slug} href={lang.link}>{lang.label}</a>
						</li>
					);
				})}
			</ul>
		);
	},
});