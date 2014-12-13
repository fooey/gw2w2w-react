/*jslint node: true */
'use strict';


/*
*
*	Routing
*
*/

var page = require('page');
page('/:langSlug(en|de|es|fr)?', require('./overview.jsx'));
page('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)', require('./tracker.jsx'));



/*
*
*	DOM Ready
*
*/

$(function() {
	page.start({
		click: true,
		popstate: false,
		dispatch: true,
	});

	process.nextTick(eml);
});



/*
*
*	Util
*
*/

function eml() {
	var chunks = ['gw2w2w', 'schtuph', 'com', '@', '.'];
	var addr = [chunks[0], chunks[3], chunks[1], chunks[4], chunks[2]].join('');

	$('.nospam-prz').each(function() {
		$(this).replaceWith(
			$('<a>', {href: ('mailto:' + addr), text: addr})
		);
	});
}
