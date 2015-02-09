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
			<ul id="log-event-filters" className="nav nav-pills">
				<li className={(props.eventFilter === 'claim') ? 'active': 'null'}>
					<a onClick={props.setEvent} data-filter="claim">Claims</a>
				</li>
				<li className={(props.eventFilter === 'capture') ? 'active': 'null'}>
					<a onClick={props.setEvent} data-filter="capture">Captures</a>
				</li>
				<li className={(props.eventFilter === 'all') ? 'active': 'null'}>
					<a onClick={props.setEvent} data-filter="all">All</a>
				</li>
			</ul>
		);
	}
}



/*
*	Class Properties
*/

MapFilters.propTypes = {
	eventFilter: React.PropTypes.oneOf([
		'all',
		'capture',
		'claim',
	]).isRequired,
	setEvent: React.PropTypes.func.isRequired,
};




/*
*
*	Export Module
*
*/

export default MapFilters;
