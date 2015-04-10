'use strict';


/*
*
*	Dependencies
*
*/

const React		= require('react');
const Immutable	= require('Immutable');




/*
*
*	Exported Component
*
*/

const propTypes = {
	lang	: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	world	: React.PropTypes.instanceOf(Immutable.Map),
	linkLang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

class LangLink extends React.Component {
	render() {
		const isActive	= Immutable.is(this.props.lang, this.props.linkLang);
		const title		= this.props.linkLang.get('name');
		const label		= this.props.linkLang.get('label');
		const link		= getLink(this.props.linkLang, this.props.world);

		return <li className={isActive ? 'active' : ''} title={title}>
			<a href={link}>{label}</a>
		</li>;
	}
}



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




/*
*
*	Export Module
*
*/

LangLink.propTypes	= propTypes;
module.exports		= LangLink;
