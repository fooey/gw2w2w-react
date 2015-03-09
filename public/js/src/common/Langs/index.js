'use strict';


/*
*
*	Dependencies
*
*/

const React = require('react');
const Immutable = require('Immutable');

const STATIC = require('lib/static');



/*
*	React Components
*/

const LangLink = require('./LangLink');





/*
*
*	Exported Component
*
*/

class Langs extends React.Component {
	render() {

		// console.log('Langs::render()', this.props.lang.toJS());

		return (
			<ul className='nav navbar-nav'>
				{STATIC.langs.toSeq().map((linkLang, key) =>
					<LangLink
						key={key}
						linkLang={linkLang}
						lang={this.props.lang}
						world={this.props.world}
					/>
				)}
			</ul>
		);
	}
}



/*
*	Class Properties
*/

Langs.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	world: React.PropTypes.instanceOf(Immutable.Map),
};




/*
*
*	Export Module
*
*/

module.exports = Langs;
