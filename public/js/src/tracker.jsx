/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');

var Tracker = React.createFactory(require('./jsx/Tracker.jsx'));

var Langs = React.createFactory(require('./jsx/Langs.jsx'));
var langs = require('gw2w2w-static').langs;

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug;
	var worldSlug = ctx.params.worldSlug;

	var appState = window.app.state;
	appState.lang = langs[langSlug];

	React.render(<Langs langSlug={langSlug} worldSlug={worldSlug} />, document.getElementById('nav-langs'));
	React.render(<Tracker worldSlug={worldSlug} />, document.getElementById('content'));
};
