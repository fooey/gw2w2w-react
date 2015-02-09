'use strict';

/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim




/*
*
*	Component Definition
*
*/

class Emblem extends React.Component {
	render() {
		var props = this.props;

		var emblemSrc = getEmblemSrc(props.guildName);

		return <img
			className="emblem"
			src={emblemSrc}
			width={props.size}
			height={props.size}
		/>;
	}
}



/*
*	Class Properties
*/

Emblem.defaultProps = {
	size: 256,
};

Emblem.propTypes = {
	guildName: React.PropTypes.string.isRequired,
	size: React.PropTypes.number.isRequired,
};




/*
*
*	Export Module
*
*/

export default Emblem;





/*
*
*	Private Methods
*
*/

function getEmblemSrc(guildName) {
	return `http:\/\/guilds.gw2w2w.com\/guilds\/${slugify(guildName)}\/256.svg`;
}



function slugify(str) {
	return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
}
