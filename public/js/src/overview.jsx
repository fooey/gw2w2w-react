'use strict';

/*
*	Dependencies
*/

var React = require('React');	// browserify shim





/*
*	React Components
*/

var Overview = require('./jsx/Overview.jsx');
var Langs = require('./jsx/Langs.jsx');





/*
*	Component Globals
*/

var langs = require('gw2w2w-static').langs;





/*
*	Export
*/

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug || 'en';
	var lang = langs[langSlug];

	React.render(<Langs lang={lang} />, document.getElementById('nav-langs'));
	React.render(<Overview lang={lang} />, document.getElementById('content'));
};
