/*jslint node: true */
"use strict";

var React = require('React');

var Overview = React.createFactory(require('./jsx/Overview.jsx'));

var Langs = React.createFactory(require('./jsx/Langs.jsx'));
var langs = require('gw2w2w-static').langs;

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug || 'en';

	var appState = window.app.state;
	appState.lang = langs[langSlug];

	React.render(<Langs langSlug={langSlug} />, document.getElementById('nav-langs'));
	React.render(<Overview />, document.getElementById('content'));
};
