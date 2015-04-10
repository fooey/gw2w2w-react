'use strict';
require("babel/polyfill");

/*
*
*	Dependencies
*
*/

const React		= require('react');
const Immutable	= require('Immutable');
const page		= require('page');

const STATIC	= require('lib/static');



/*
*	React Components
*/

const Langs		= require('common/Langs');
const Overview	= require('Overview');
const Tracker	= require('Tracker');





/*
*
*	DOM Ready
*
*/

$(function() {
	attachRoutes();
	setImmediate(eml);
});






/*
*
*	Routes
*
*/

function attachRoutes() {
	const domMounts = {
		navLangs: document.getElementById('nav-langs'),
		content	: document.getElementById('content'),
	};


	page('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)?', function(ctx) {
		const langSlug	= ctx.params.langSlug;
		const lang		= STATIC.langs.get(langSlug);

		const worldSlug	= ctx.params.worldSlug;
		const world		= getWorldFromSlug(langSlug, worldSlug);


		let App		= Overview;
		let props	= {lang};

		if (world && Immutable.Map.isMap(world) && !world.isEmpty()) {
			App = Tracker;
			props.world = world;
		}


		React.render(<Langs {...props} />, domMounts.navLangs);
		React.render(<App {...props} />, domMounts.content);
	});



	// redirect '/' to '/en'
	page('/', redirectPage.bind(null, '/en'));




	page.start({
		click	: true,
		popstate: true,
		dispatch: true,
		hashbang: false,
		decodeURLComponents : true,
	});
}





/*
*
*	Util
*
*/

function redirectPage(destination) {
	page.redirect(destination);
}



function getWorldFromSlug(langSlug, worldSlug) {
	return STATIC.worlds
		.find(world => world.getIn([langSlug, 'slug']) === worldSlug);
}



function eml() {
	const chunks = ['gw2w2w', 'schtuph', 'com', '@', '.'];
	const addr = [chunks[0], chunks[3], chunks[1], chunks[4], chunks[2]].join('');

	$('.nospam-prz').each((i, el) => {
		$(el).replaceWith(
			$('<a>', {href: `mailto:${addr}`, text: addr})
		);
	});
}
