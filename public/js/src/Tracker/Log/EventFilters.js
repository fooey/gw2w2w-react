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
		return (this.props.eventFilter !== nextProps.eventFilter);
	}



	render() {
		const props = this.props;

		return (
			<ul id="log-event-filters" className="nav nav-pills">
				<li className={(props.eventFilter === 'claim') ? 'active': null}>
					<a onClick={props.setEvent} data-filter="claim">Claims</a>
				</li>
				<li className={(props.eventFilter === 'capture') ? 'active': null}>
					<a onClick={props.setEvent} data-filter="capture">Captures</a>
				</li>
				<li className={(props.eventFilter === 'all') ? 'active': null}>
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

module.exports = MapFilters;
