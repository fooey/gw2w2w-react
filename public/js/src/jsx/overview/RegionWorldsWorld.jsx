'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import _ from 'lodash';
import Immutable from 'Immutable'; // browserify shim




/*
*
*	Component Definition
*
*/

class RegionWorldsWorld extends React.Component {
	shouldComponentUpdate(nextProps) {
		var shouldUpdate = !Immutable.is(this.props.world, nextProps.world) || !Immutable.is(this.props.lang, nextProps.lang);
		// console.log('RegionWorldsWorld::shouldComponentUpdate', shouldUpdate);
		return shouldUpdate;
	}

	render() {
		var props = this.props;

		var href = getLink(props.lang.slug, props.world.slug);

		// console.log('RegionWorldsWorld::render', props.world.name);

		return <li><a href={href}>{props.world.name}</a></li>;
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