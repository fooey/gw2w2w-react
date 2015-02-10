'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import _ from 'lodash';
import Immutable from 'Immutable'; // browserify shim


import STATIC from '../../lib/static';



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
	shouldComponentUpdate(nextProps) {
		var shouldUpdate = !Immutable.is(this.props.region, nextProps.region) || !Immutable.is(this.props.lang, nextProps.lang);
		// console.log('RegionWorlds::shouldComponentUpdate', shouldUpdate);
		return shouldUpdate;
	}



	render() {
		var props = this.props;

		// console.log('RegionWorlds::render()', props.region.get('label'));

		var label = props.region.get("label") + ' Worlds';

		var regionWorlds = Immutable.Seq(STATIC.worlds)
			.filter(world => _.parseInt(world.region) === _.parseInt(props.region.get("id")))
			.sort((a, b) => {
				var x = a[props.lang.slug].name;
				var y = b[props.lang.slug].name;

				return (x > y) ? 1
					: (x < y) ? -1
					: 0;
			});

		return (
			<div className="RegionWorlds">
				<h2>{label}</h2>
				<ul className="list-unstyled">
					{regionWorlds.map(world =>
						<RegionWorldsWorld
							key={world.id}
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
