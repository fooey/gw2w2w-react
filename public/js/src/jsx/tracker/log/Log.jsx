'use strict';

/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim
var $ = require('jquery');		// browserify shim





/*
*	React Components
*/

var Entry = require('./Entry.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var mapsStatic = staticData.objective_map;
var objectivesMeta = staticData.objective_meta;





/*
*	Component Export
*/

module.exports = React.createClass({
	getInitialState: getInitialState,
	render: render,
	componentDidMount: componentDidMount,
	componentDidUpdate: componentDidUpdate,

	setWorld: setWorld,
	setEvent: setEvent,
});






/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function getInitialState() {
	return {
		mapFilter: 'all',
		eventFilter: 'all',
		animateEntry: false,
	};
}



function render() {
	var component = this;
	var props = component.props;
	var state = component.state;

	var dateNow = props.dateNow;
	var timeOffset = props.timeOffset;
	var lang = props.lang;
	var guilds = props.guilds;
	var matchWorlds = props.matchWorlds;

	var eventFilter = state.eventFilter;
	var mapFilter = state.mapFilter;


	var eventHistory = _.chain(props.eventHistory)
		.filter(function(entry) {
			return (eventFilter == 'all' || entry.type == eventFilter);
		})
		.filter(function(entry) {
			var oMeta = objectivesMeta[entry.objectiveId];
			return (mapFilter == 'all' || oMeta.map == mapFilter);
		})
		.sortBy('timestamp')
		.reverse()
		.map(function(entry, ixEntry) {
			var guildId, guild;

			if (entry.type === 'claim') {
				guildId = entry.guild;
				guild = (guilds && guildId && guilds[guildId]) ? guilds[guildId] : null;
			}

			return (
				<Entry
					key={entry.id}
					lang={lang}

					animateEntry={state.animateEntry}
					entryId={entry.id}
					objectiveId={entry.objectiveId}
					worldColor={entry.world}
					timestamp={entry.timestamp}
					eventType={entry.type}
					guildId={guildId}
					guild={guild}
				/>
			);
		})
		.value();


	return (
		<div id="log-container">

			<div className="log-tabs">
				<div className="row">
					<div className="col-sm-16">
						<ul id="log-map-filters" className="nav nav-pills">

							<li className={(mapFilter == 'all') ? 'active': 'null'}>
								<a onClick={component.setWorld} data-filter="all">All</a>
							</li>

							{_.map(mapsStatic, function(mapMeta, ixMap) {
								return (
									<li key={mapMeta.mapIndex} className={(mapFilter === mapMeta.mapIndex) ? 'active': 'null'}>
										<a onClick={component.setWorld} data-filter={mapMeta.mapIndex}>{mapMeta.abbr}</a>
									</li>
								);
							})}

						</ul>
					</div>
					<div className="col-sm-8">
						<ul id="log-event-filters" className="nav nav-pills">
							<li className={(eventFilter === 'claim') ? 'active': 'null'}>
								<a onClick={component.setEvent} data-filter="claim">Claims</a>
							</li>
							<li className={(eventFilter === 'capture') ? 'active': 'null'}>
								<a onClick={component.setEvent} data-filter="capture">Captures</a>
							</li>
							<li className={(eventFilter === 'all') ? 'active': 'null'}>
								<a onClick={component.setEvent} data-filter="all">All</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<ul className="list-unstyled" id="log">
				{eventHistory}
			</ul>

		</div>
	);
}




function componentDidMount() {
	var component = this;

	component.setState({animateEntry: true});
}




function componentDidUpdate() {
	var component = this;
	var state = component.state;

	if (!state.animateEntry) {
		component.setState({animateEntry: true});
	}
}






/*
*	Component Helper Methods
*/

function setWorld(e) {
	var component = this;

	var filter = e.target.getAttribute('data-filter');

	component.setState({mapFilter: filter, animateEntry: false});
}



function setEvent(e) {
	var component = this;

	var filter = e.target.getAttribute('data-filter');

	component.setState({eventFilter: filter, animateEntry: false});
}
