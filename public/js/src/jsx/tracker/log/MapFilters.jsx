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




/*
*
*	Component Definition
*
*/

class MapFilters extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !_.isEqual(this.props, nextProps);
	}



	render() {
		var props = this.props;

		return (
			<ul id="log-map-filters" className="nav nav-pills">

				<li className={(props.mapFilter === 'all') ? 'active': 'null'}>
					<a onClick={props.setWorld} data-filter="all">All</a>
				</li>

				{_.map(STATIC.objective_map, mapMeta =>
					<li key={mapMeta.mapIndex} className={(props.mapFilter === mapMeta.mapIndex) ? 'active': 'null'}>
						<a onClick={props.setWorld} data-filter={mapMeta.mapIndex}>{mapMeta.abbr}</a>
					</li>
				)}

			</ul>
		);
	}
}



/*
*	Class Properties
*/

MapFilters.propTypes = {
	mapFilter: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
	]).isRequired,
	setWorld: React.PropTypes.func.isRequired,
};




/*
*
*	Export Module
*
*/

export default MapFilters;
