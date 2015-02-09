'use strict';

/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim

import STATIC from 'gw2w2w-static';





/*
*	React Components
*/

import Overview from './jsx/Overview.jsx';
import Langs from './jsx/Langs.jsx';





/*
*	Export
*/

export default function overview(ctx) {
	const langSlug = ctx.params.langSlug || 'en';
	const lang = STATIC.langs[langSlug];

	React.render(<Langs lang={lang} />, document.getElementById('nav-langs'));
	React.render(<Overview lang={lang} />, document.getElementById('content'));
}
