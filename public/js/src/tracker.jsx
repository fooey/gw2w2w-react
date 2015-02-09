'use strict';

/*
*
*	Dependencies
*
*/

const React = require('React'); // browserify shim
const _ = require('lodash');
import STATIC from 'gw2w2w-static';





/*
*	React Components
*/

const Tracker = require('./jsx/Tracker.jsx');
const Langs = require('./jsx/Langs.jsx');





/*
*	Export
*/

export default function overview(ctx) {
	const langSlug = ctx.params.langSlug;
	const worldSlug = ctx.params.worldSlug;

	const lang = STATIC.langs[langSlug];
	const world = _.find(STATIC.worlds, function(world) {
		return world[lang.slug].slug === worldSlug;
	});


	React.render(<Langs lang={lang} world={world} />, document.getElementById('nav-langs'));
	React.render(<Tracker lang={lang} world={world} />, document.getElementById('content'));
}
