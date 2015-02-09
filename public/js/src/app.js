'use strict';

// require("6to5/polyfill"); // using <script /> instead


/*
*
*	App Globals
*
*/




/*
*
*	Routing
*
*/

import page from 'page';
import Overview from './overview.jsx';
import Tracker from './tracker.jsx';

page('/:langSlug(en|de|es|fr)?', Overview);
page('/:langSlug(en|de|es|fr)/:worldSlug([a-z-]+)', Tracker);





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

	setTimeout(eml.bind(null), 0);
});





/*
*
*	Util
*
*/

function eml() {
	const chunks = ['gw2w2w', 'schtuph', 'com', '@', '.'];
	const addr = [chunks[0], chunks[3], chunks[1], chunks[4], chunks[2]].join('');

	$('.nospam-prz').each((i,el) => {
		$(this).replaceWith(
			$('<a>', {href: ('mailto:' + addr), text: addr})
		);
	});
}
