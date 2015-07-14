'use strict';

/*
 *
 * Dependencies
 *
 */

const React     = require('react');
const Immutable = require('Immutable');




/*
 *
 * Exported Component
 *
 */

class LangLink extends React.Component {
    static propTypes = {
        lang    : React.PropTypes.instanceOf(Immutable.Map).isRequired,
        linkLang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
        world   : React.PropTypes.instanceOf(Immutable.Map),
    }



    render() {
        const isActive  = Immutable.is(this.props.lang, this.props.linkLang);
        const listClass = isActive ? 'active' : '';

        const title     = this.props.linkLang.get('name');
        const label     = this.props.linkLang.get('label');
        const link      = getLink(this.props.linkLang, this.props.world);

        return (
            <li className = {listClass} title = {title}>
                <a href = {link}>{label}</a>
            </li>
        );
    }
}



/*
 *
 * Private Methods
 *
 */

function getLink(lang, world) {
    const langSlug = lang.get('slug');

    let link = `/${langSlug}`;

    if (world) {
        const worldSlug = world.getIn([langSlug, 'slug']);

        link += `/${worldSlug}`;
    }

    return link;
}




/*
 *
 * Export Module
 *
 */

module.exports = LangLink;
