"use strict";

/*
 *
 * Dependencies
 *
 */

const React = require('react');




/*
 *
 * Component Globals
 *
 */

const imgPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>';



/*
 *
 * Component Definition
 *
 */

const propTypes = {
    guildName: React.PropTypes.string,
    size     : React.PropTypes.number.isRequired,
};

const defaultProps = {
    guildName: undefined,
    size: 256,
};

class Emblem extends React.Component {
    shouldComponentUpdate(nextProps) {
        const newGuildName = (this.props.guildName !== nextProps.guildName);
        const newSize      = (this.props.size !== nextProps.size);
        const shouldUpdate = (newGuildName || newSize);

        return shouldUpdate;
    }

    render() {
        const emblemSrc = getEmblemSrc(this.props.guildName);

        return <img
            className = "emblem"
            src       = {emblemSrc}
            width     = {this.props.size}
            height    = {this.props.size}
            onError   = {imgOnError}
        />;
    }
}




/*
 *
 * Private Methods
 *
 */

function getEmblemSrc(guildName) {
    return (guildName)
        ? `http:\/\/guilds.gw2w2w.com\/guilds\/${slugify(guildName)}\/256.svg`
        : imgPlaceholder;
}



function slugify(str) {
    return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
}



function imgOnError(e) {
    const currentSrc = $(e.target).attr('src');

    if (currentSrc !== imgPlaceholder) {
        $(e.target).attr('src', imgPlaceholder);
    }
}





/*
 *
 * Export Module
 *
 */

Emblem.propTypes    = propTypes;
Emblem.defaultProps = defaultProps;

module.exports      = Emblem;
