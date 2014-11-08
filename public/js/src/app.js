/*jslint node: true */
"use strict";

/*
*
*	config
*
*/

window.app = {
	state: {
		lang: 'en',
	},
	guilds: {},
 };



/*
*
*	Routing
*
*/

var page = require('page');
page('/:langSlug(en|de|es|fr)?', require('./overview.jsx'));
page('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)', require('./tracker.jsx'));

$(function() {
	page.start({
		click: true,
		popstate: false,
		dispatch: true,
	});
});
