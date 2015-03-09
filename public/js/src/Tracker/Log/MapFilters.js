'use strict';

/*
*
*	Dependencies
*
*/

const React = require('react');

const _ = require('lodash');

const STATIC = require('gw2w2w-static');



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
		return (this.props.mapFilter !== nextProps.mapFilter);
	}



	render() {
		const props = this.props;

		return (
			<ul id="log-map-filters" className="nav nav-pills">

				<li className={(props.mapFilter === 'all') ? 'active': 'null'}>
					<a onClick={props.setWorld} data-filter="all">All</a>
				</li>

				{_.map(STATIC.objective_map, mapMeta =>
					<li key={mapMeta.mapIndex} className={(props.mapFilter === mapMeta.color) ? 'active': null}>
						<a onClick={props.setWorld} data-filter={mapMeta.color}>{mapMeta.abbr}</a>
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
	mapFilter: React.PropTypes.string.isRequired,
	setWorld: React.PropTypes.func.isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = MapFilters;
