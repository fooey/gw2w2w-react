'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim





/*
*
*	Exported Component
*
*/

export default class LangLink extends React.Component {
	render() {
		var props = this.props;

		var link = getLangLink(props.linkLang, props.world);

		return (
			<li className={(props.linkLang.slug === props.lang.slug) ? 'active' : ''} title={props.linkLang.name}>
				<a data-slug={props.linkLang.slug} href={link}>{props.linkLang.label}</a>
			</li>
		);
	}
}





/*
*
*	Private Methods
*
*/

function getLangLink(lang, world) {
	var link = `/${lang.slug}`;

	if (world) {
		link += `/${world[lang.slug].slug}`;
	}

	return link;
}
