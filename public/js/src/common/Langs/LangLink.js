'use strict';


/*
*
*	Dependencies
*
*/

const React = require('react');
const Immutable = require('Immutable');




/*
*
*	Exported Component
*
*/

class LangLink extends React.Component {
	render() {
		const props = this.props;

		const isActive = Immutable.is(props.lang, props.linkLang);
		const title = props.linkLang.get('name');
		const label = props.linkLang.get('label');
		const link = getLink(props.linkLang, props.world);

		return <li className={isActive ? 'active' : ''} title={title}>
			<a href={link}>{label}</a>
		</li>;
	}
}



/*
*	Class Properties
*/

LangLink.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	world: React.PropTypes.instanceOf(Immutable.Map),
	linkLang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = LangLink;




/*
*
*	Private Methods
*
*/

function getLink(lang, world) {
	const langSlug = lang.get('slug');

	let link = `/${langSlug}`;

	if (world) {
		let worldSlug = world.getIn([langSlug, 'slug']);
		link += `/${worldSlug}`;
	}

	return link;
}