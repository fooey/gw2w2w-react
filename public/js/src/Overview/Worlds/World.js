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
*	Component Definition
*
*/

class RegionWorldsWorld extends React.Component {
	shouldComponentUpdate(nextProps) {
		const newLang = !Immutable.is(this.props.lang, nextProps.lang);
		const newWorld = !Immutable.is(this.props.world, nextProps.world);
		const shouldUpdate = (newLang || newWorld);

		return shouldUpdate;
	}

	render() {
		const props = this.props;

		// console.log('RegionWorldsWorld::render', props.world.toJS());

		return <li><a href={props.world.get('link')}>{props.world.get('name')}</a></li>;
	}

}



/*
*	Class Properties
*/

RegionWorldsWorld.propTypes = {
	world: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = RegionWorldsWorld;
