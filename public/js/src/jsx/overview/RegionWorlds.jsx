'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import _ from 'lodash';


import STATIC from 'gw2w2w-static';



/*
*	React Components
*/

import RegionWorldsWorld from './RegionWorldsWorld.jsx';




/*
*
*	Component Definition
*
*/

class RegionWorlds extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		var label = props.region.label + ' Worlds';

		var worlds = _.chain(STATIC.worlds)
			.filter(world => world.region === props.region.id)
			.sortBy(world => world[props.lang.slug].name)
			.value();

		return (
			<div className="RegionWorlds">
				<h2>{label}</h2>
				<ul className="list-unstyled">
					{_.map(worlds, (world, index) =>
						<RegionWorldsWorld
							key={index}
							lang={props.lang}
							world={world[props.lang.slug]}
						/>
					)}
				</ul>
			</div>
		);
	}
}



/*
*	Class Properties
*/

RegionWorlds.propTypes = {
	lang: React.PropTypes.object.isRequired,
	region: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default RegionWorlds;
