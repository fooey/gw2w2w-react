'use strict';

/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim





/*
*	React Components
*/

var Tracker = require('./jsx/Tracker.jsx');
var Langs = require('./jsx/Langs.jsx');





/*
*	Component Globals
*/

var langs = require('gw2w2w-static').langs;
var worlds = require('gw2w2w-static').worlds;





/*
*	Export
*/

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug;
	var lang = langs[langSlug];

	var worldSlug = ctx.params.worldSlug;
	var world = _.find(worlds, function(world) {
		return world[lang.slug].slug === worldSlug;
	});


	React.render(<Langs lang={lang} world={world} />, document.getElementById('nav-langs'));
	React.render(<Tracker lang={lang} world={world} />, document.getElementById('content'));
};
