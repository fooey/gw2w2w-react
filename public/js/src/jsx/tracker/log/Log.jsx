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

import MapFilters from './MapFilters.jsx';
import EventFilters from './EventFilters.jsx';
import LogEntries from './LogEntries.jsx';




/*
*
*	Component Definition
*
*/

class Log extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mapFilter: 'all',
			eventFilter: 'all',
			triggerNotification: false,
		};
	}



	shouldComponentUpdate(nextProps, nextState) {
		return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
	}



	componentDidMount() {
		var component = this;

		component.setState({triggerNotification: true});
	}



	componentDidUpdate() {
		var component = this;
		var state = component.state;

		if (!state.triggerNotification) {
			component.setState({triggerNotification: true});
		}
	}



	render() {
		var component = this;
		var props = this.props;
		var state = this.state;

		var eventHistory = _.chain(_.assign({}, props.details.history))
			.filter(entry => (state.eventFilter === 'all' || entry.type === state.eventFilter))
			.filter(entry => {
				let oMeta = STATIC.objective_meta[entry.objectiveId];
				let mapFilter = (state.mapFilter === 'all')
					? state.mapFilter
					: _.parseInt(state.mapFilter);

				return (mapFilter === 'all' || oMeta.map === mapFilter);
			})
			.sortBy('timestamp')
			.reverse()
			.value();


		return (
			<div id="log-container">

				<div className="log-tabs">
					<div className="row">
						<div className="col-sm-16">
							<MapFilters
								mapFilter={state.mapFilter}
								setWorld={setWorld.bind(component)}
							/>
						</div>
						<div className="col-sm-8">
							<EventFilters
								eventFilter={state.eventFilter}
								setEvent={setEvent.bind(component)}
							/>
						</div>
					</div>
				</div>

				{(eventHistory && eventHistory.length)
					? <LogEntries
						triggerNotification={state.triggerNotification}

						lang={props.lang}
						guilds={props.guilds}
						libAudio={props.libAudio}
						options={props.options}

						eventHistory={eventHistory}
					/>
					: null
				}

			</div>
		);
	}
}



/*
*	Class Properties
*/

Log.defaultProps = {
	guilds: {},
};

Log.propTypes = {
	lang: React.PropTypes.object.isRequired,
	details: React.PropTypes.object.isRequired,
	libAudio: React.PropTypes.object.isRequired,
	options: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default Log;





/*
*
*	Private Methods
*
*/

function setWorld(e) {
	var component = this;

	var filter = e.target.getAttribute('data-filter');

	filter = (filter === 'all')
			? filter
			: _.parseInt(filter)

	component.setState({mapFilter: filter, triggerNotification: false});
}



function setEvent(e) {
	var component = this;

	var filter = e.target.getAttribute('data-filter');

	component.setState({eventFilter: filter, triggerNotification: false});
}
