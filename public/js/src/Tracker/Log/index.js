'use strict';

/*
*
*	Dependencies
*
*/

const React = require('react');
const Immutable = require('Immutable');

const STATIC = require('gw2w2w-static');



/*
*	React Components
*/

const MapFilters = require('./MapFilters');
const EventFilters = require('./EventFilters');
const LogEntries = require('./LogEntries');




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
		const newLang = !Immutable.is(this.props.lang, nextProps.lang);
		const newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
		const newHistory = !Immutable.is(this.props.details.get('history'), nextProps.details.get('history'));

		const newMapFilter = !Immutable.is(this.state.mapFilter, nextState.mapFilter);
		const newEventFilter = !Immutable.is(this.state.eventFilter, nextState.eventFilter);

		const shouldUpdate = (
			newLang
			|| newGuilds
			|| newHistory
			|| newMapFilter
			|| newEventFilter
		);

		return shouldUpdate;
	}



	componentDidMount() {
		this.setState({triggerNotification: true});
	}



	componentDidUpdate() {
		if (!this.state.triggerNotification) {
			this.setState({triggerNotification: true});
		}
	}



	render() {
		const component = this;
		const props = this.props;
		const state = this.state;

		// console.log('Log::render()', state.mapFilter, state.eventFilter, state.triggerNotification);

		const eventHistory = props.details.get('history');

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

				{!eventHistory.isEmpty()
					? <LogEntries
						triggerNotification={state.triggerNotification}
						mapFilter={state.mapFilter}
						eventFilter={state.eventFilter}

						lang={props.lang}
						guilds={props.guilds}

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

Log.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = Log;





/*
*
*	Private Methods
*
*/

function setWorld(e) {
	let component = this;

	let filter = e.target.getAttribute('data-filter');

	component.setState({mapFilter: filter, triggerNotification: true});
}



function setEvent(e) {
	let component = this;

	let filter = e.target.getAttribute('data-filter');

	component.setState({eventFilter: filter, triggerNotification: true});
}
