/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');

var langs = require('gw2w2w-static').langs;
var worlds = require('gw2w2w-static').worlds;

module.exports = React.createClass({	
	render: function() {
		var lang = this.props.lang;
		var world = this.props.world;

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
	},
});