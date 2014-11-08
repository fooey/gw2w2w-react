/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');
var $ = require('jquery');

var Objective = React.createFactory(require('./Objective.jsx'));

var staticData = require('gw2w2w-static');
var objectivesMeta = staticData.objective_meta;


module.exports = React.createClass({
	getInitialState: function() {
		return {
			mapFilter: 'all',
			eventFilter: 'all',
		};
	},

	render: function() {
		var dateNow = this.props.dateNow;
		var guilds = this.props.guilds;
		var matchWorlds = this.props.matchWorlds;
		var mapsMeta = this.props.mapsMeta;

		var setWorld = this.setWorld;
		var setEvent = this.setEvent;

		var eventFilter = this.state.eventFilter;
		var mapFilter = this.state.mapFilter;

		var eventHistory = _.chain(this.props.eventHistory)
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
				return (
					<li key={key} className="transition">
						<Objective
							dateNow={dateNow}
							entry={entry}
							guilds={guilds}
							ixEntry={ixEntry}
							matchWorlds={matchWorlds}
							mapsMeta={mapsMeta}
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
									<a onClick={setWorld} data-filter="all">All</a>
								</li>

								{_.map([
									mapsMeta[3],
									mapsMeta[0],
									mapsMeta[2],
									mapsMeta[1],
								], function(mapMeta, i) {
									return (
										<li key={mapMeta.index} className={(mapFilter === mapMeta.index) ? 'active': 'null'}>
											<a onClick={setWorld} data-filter={mapMeta.index}>{mapMeta.name}</a>
										</li>
									);
								})}
							</ul>
						</div>
						<div className="col-sm-8">
							<ul id="log-event-filters" className="nav nav-pills">
								<li className={(eventFilter === 'claim') ? 'active': 'null'}>
									<a onClick={setEvent} data-filter="claim">Claims</a>
								</li>
								<li className={(eventFilter === 'capture') ? 'active': 'null'}>
									<a onClick={setEvent} data-filter="capture">Captures</a>
								</li>
								<li className={(eventFilter === 'all') ? 'active': 'null'}>
									<a onClick={setEvent} data-filter="all">All</a>
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
	},

	setWorld: function(e) {
		var filter = $(e.target).data('filter');
		this.setState({mapFilter: filter});
	},
	setEvent: function(e) {
		var filter = $(e.target).data('filter');
		this.setState({eventFilter: filter});
	},
});

/*

*/
