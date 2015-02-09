'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import _ from 'lodash';




/*
*
*	Component Definition
*
*/

class RegionWorldsWorld extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		var href = getLink(props.lang.slug, props.world.slug);
		var label = props.world.name;

		return <li><a href={href}>{label}</a></li>;
	}

}



/*
*	Class Properties
*/

RegionWorldsWorld.propTypes = {
	lang: React.PropTypes.object.isRequired,
	world: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default RegionWorldsWorld;




/*
*
*	Private Methods
*
*/

function getLink(langSlug, worldSlug) {
	return [
		'',
		langSlug,
		worldSlug
	].join('/');
}