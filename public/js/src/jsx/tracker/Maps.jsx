'use strict';


/*
*	Dependencies
*/

var React = require('React');	// browserify shim
var _ = require('lodash');		// browserify shim





/*
*	React Components
*/

var MapDetails = require('./maps/MapDetails.jsx');
var Log = require('./log/Log.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var mapsConfig = staticData.objective_map;





/*
*	Component Export
*/

module.exports = React.createClass({
	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/

function render() {
	var component = this;
	var props = component.props;

	if (!props.details.initialized) {
		return null;
	}

	var lang = props.lang;
	var details = props.details;
	var matchWorlds = props.matchWorlds;
	var guilds = props.guilds;

	var eventHistory = details.history;



	function getMapDetails(mapKey) {
		return (
			<MapDetails
				mapKey={mapKey}
				lang={lang}

				details={details}
				guilds={guilds}
				matchWorlds={matchWorlds}
			/>);
	}



	return (
		<section id="maps">
			<h1>Maps</h1>
			<div className="row">

				<div className="col-md-6">{getMapDetails('Center')}</div>

				<div className="col-md-18">

					<div className="row">
						<div className="col-md-8">{getMapDetails('RedHome')}</div>
						<div className="col-md-8">{getMapDetails('BlueHome')}</div>
						<div className="col-md-8">{getMapDetails('GreenHome')}</div>
					</div>

					<div className="row">
						<div className="col-md-24">
							<Log
								lang={lang}

								eventHistory={eventHistory}
								guilds={guilds}
								matchWorlds={matchWorlds}
							/>
						</div>
					</div>

				</div>
			 </div>
		</section>
	);
}
