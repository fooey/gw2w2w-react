/*
*
*	config
*
*/

 var app = window.app = {
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
page('/:langSlug(en|de|es|fr)?', require('./overview'));
page('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)', require('./tracker'));

$(function() {
	page.start({
		click: true,
		popstate: false,
		dispatch: true,
	});
});
