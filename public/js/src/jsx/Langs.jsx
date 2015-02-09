'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import _ from 'lodash';

import STATIC from 'gw2w2w-static';



/*
*	React Components
*/

import LangLink from './LangLink.jsx';





/*
*
*	Exported Component
*
*/

export default class Langs extends React.Component {
	render() {
		var props = this.props;

		return (
			<ul className='nav navbar-nav'>
				{_.map(STATIC.langs, lang =>
					<LangLink {...props} key={lang.slug} linkLang={lang} />
				)}
			</ul>
		);
	}
}