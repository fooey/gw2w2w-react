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

var Objective = require('../objectives/Objective.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var mapsStatic = staticData.objective_map;
var objectivesMeta = staticData.objective_meta;

var objectiveCols = {
	elapsed: true,
	timestamp: true,
	mapAbbrev: true,
	arrow: true,
	sprite: true,
	name: true,
	eventType: true,
	guildName: true,
	guildTag: true,
	timer: false,
};





/*
*	Component Export
*/

module.exports = React.createClass({
	getInitialState: getInitialState,
	render: render,

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

			var key = entry.timestamp + '-' + entry.objectiveId  + '-' + entry.type;
			var guildId = (entry.guild) ? entry.guild : null;

			return (
				<li key={key} className="transition">
					<Objective
						lang={lang}
						dateNow={dateNow}
						timeOffset={timeOffset}
						cols={objectiveCols}

						objectiveId={entry.objectiveId}
						worldColor={entry.world}
						timestamp={entry.timestamp}
						guildId={guildId}
						eventType={entry.type}
						guilds={guilds}
					/>
				</li>
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





/*
*	Component Helper Methods
*/

function setWorld(e) {
	var component = this;

	var filter = $(e.target).data('filter');
	console.log('setWorld', filter);

	component.setState({mapFilter: filter});
}



function setEvent(e) {
	var component = this;

	var filter = $(e.target).data('filter');

	component.setState({eventFilter: filter});
}
