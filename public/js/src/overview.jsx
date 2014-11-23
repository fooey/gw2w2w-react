/*jslint node: true */
"use strict";

var React = require('React');

var Overview = require('./jsx/Overview.jsx');
var Langs = require('./jsx/Langs.jsx');

var langs = require('gw2w2w-static').langs;

module.exports = function overview(ctx) {
	var langSlug = ctx.params.langSlug || 'en';
	var lang = langs[langSlug];

	React.render(<Langs lang={lang} />, document.getElementById('nav-langs'));
	React.render(<Overview lang={lang} />, document.getElementById('content'));
};

