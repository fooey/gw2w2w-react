/*jslint node: true */
"use strict";

var React = require('React');
var _ = require('lodash');


var MapDetails = React.createFactory(require('./MapDetails.jsx'));
var Log = React.createFactory(require('./log/Log.jsx'));

var libDate = require('../../lib/date.js');

var staticData = require('gw2w2w-static');
var mapsConfig = staticData.objective_map;

module.exports = React.createClass({

	getInitialState: function() {
		return {dateNow: libDate.dateNow()};
	},
	tick: function() {
		this.setState({dateNow: libDate.dateNow()});
	},
	componentDidMount: function() {
		this.interval = setInterval(this.tick, 1000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},


	render: function() {
		if (!this.props.details.initialized) {
			return null;
		}

		var dateNow = this.state.dateNow;
		var timeOffset = this.props.timeOffset;

		var lang = this.props.lang;
		var details = this.props.details;
		var matchWorlds = this.props.matchWorlds;
		var mapsMeta = this.props.mapsMeta;
		var guilds = this.props.guilds;
		
		var eventHistory = details.history;


		return (
			<div id="maps">
				<div className="row">
					<div className="col-md-6">
						<MapDetails 
							dateNow={dateNow}
							timeOffset={timeOffset}
							lang={lang}
							details={details}
							guilds={guilds}
							matchWorlds={matchWorlds}
							mapsMeta={mapsMeta}
							mapIndex={0}
						/>
					</div>
					<div className="col-md-18">

						<div className="row">
							<div className="col-md-8">
								<MapDetails 
									dateNow={dateNow}
									timeOffset={timeOffset}
									lang={lang}
									details={details}
									guilds={guilds}
									matchWorlds={matchWorlds}
									mapsMeta={mapsMeta}
									mapIndex={1}
								/>
							</div>
							<div className="col-md-8">
								<MapDetails 
									dateNow={dateNow}
									timeOffset={timeOffset}
									lang={lang}
									details={details}
									guilds={guilds}
									matchWorlds={matchWorlds}
									mapsMeta={mapsMeta}
									mapIndex={2}
								/>
							</div>
							<div className="col-md-8">
								<MapDetails 
									dateNow={dateNow}
									timeOffset={timeOffset}
									lang={lang}
									details={details}
									guilds={guilds}
									matchWorlds={matchWorlds}
									mapsMeta={mapsMeta}
									mapIndex={3}
								/>
							</div>
						</div>
						
						<div className="row">
							<div className="col-md-24">
								<Log
									dateNow={dateNow}
									timeOffset={timeOffset}
									lang={lang}
									guilds={guilds}
									eventHistory={eventHistory}
									matchWorlds={matchWorlds}
									mapsMeta={mapsMeta}
								/>
							</div>
						</div>

					</div>
				 </div>
			</div>
		);
	},
});