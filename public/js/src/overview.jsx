'use strict';

/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim

import STATIC from './lib/static';





/*
*	React Components
*/

import Overview from './jsx/Overview.jsx';
import Langs from './jsx/Langs.jsx';





/*
*	Export
*/

export default function overview(ctx) {
	var langSlug = ctx.params.langSlug || 'en';
	var lang = STATIC.langs.get(langSlug);

	React.render(<Langs lang={lang} />, document.getElementById('nav-langs'));
	React.render(<Overview lang={lang} />, document.getElementById('content'));
}
