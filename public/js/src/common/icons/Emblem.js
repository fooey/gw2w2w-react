'use strict';

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

class Emblem extends React.Component {
    static propTypes = {
        guildName: React.PropTypes.string,
        size     : React.PropTypes.number.isRequired,
    }



    static defaultProps = {
        size     : 256,
        guildName: undefined,
    }



    shouldComponentUpdate(nextProps) {
        const newName      = (this.props.guildName !== nextProps.guildName); // changes when defined
        const newSize      = (this.props.size !== nextProps.size);
        const shouldUpdate = (newSize || newName);

        return shouldUpdate;
    }

    render() {
        const emblemSrc = getEmblemSrc(this.props.guildName);

        // console.log('emblem', this.props.guildName, emblemSrc);

        return (
            <img
                className = 'emblem'

                src       = {emblemSrc}
                width     = {this.props.size}
                height    = {this.props.size}

                onError   = {imgOnError}
            />
        );
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

module.exports = Emblem;
