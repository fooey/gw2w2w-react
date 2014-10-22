/**
 * @jsx React.DOM
 */

var MapDetails = require('./MapDetails.jsx');
var libDate = require('../../lib/date.js');
var Log = require('./log/Log.jsx');

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
		var staticData = require('../../staticData');
		var mapsConfig = staticData.objectives.objective_map;

		var matchData = this.props.data;
		var objectives = this.props.objectives;
		var guilds = this.props.guilds;
		var log = this.props.log;
		var mapsScores = this.props.mapsScores;
		var matchWorlds = this.props.matchWorlds;

		if (!objectives) {
			return null;
		}


		var mapNames = ['Eternal Battlegrounds', matchWorlds[0].name, matchWorlds[1].name, matchWorlds[2].name];
		var mapColors = ['default', 'red', 'blue', 'green'];

		var dateNow = this.state.dateNow;

		return (
			<div id="maps">
				<div className="row">
					<div className="col-md-6">
						<MapDetails 
							dateNow={dateNow}
							objectives={objectives}
							guilds={guilds}
							mapsScores={mapsScores}
							mapConfig={mapsConfig[0]}
							mapName={mapNames[0]}
							mapColor={mapColors[0]}
						/>
					</div>
					<div className="col-md-18">
						<div className="row">
							<div className="col-md-8">
								<MapDetails 
									dateNow={dateNow}
									objectives={objectives}
									guilds={guilds}
									mapsScores={mapsScores}
									mapConfig={mapsConfig[1]}
									mapName={mapNames[1]}
									mapColor={mapColors[1]}
								/>
							</div>
							<div className="col-md-8">
								<MapDetails 
									dateNow={dateNow}
									objectives={objectives}
									guilds={guilds}
									mapsScores={mapsScores}
									mapConfig={mapsConfig[2]}
									mapName={mapNames[2]}
									mapColor={mapColors[2]}
								/>
							</div>
							<div className="col-md-8">
								<MapDetails 
									dateNow={dateNow}
									objectives={objectives}
									guilds={guilds}
									mapsScores={mapsScores}
									mapConfig={mapsConfig[3]}
									mapName={mapNames[3]}
									mapColor={mapColors[3]}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-md-24">
								<Log
									guilds={guilds}
									objectives={objectives}
									log={log}
								/>
							</div>
						</div>
					</div>
				 </div>
			</div>
		);
	},
});


/*

													<div>
														<div>now: {now}</div>
														<div>cap: {o.lastCap}</div>
														<div>exp: {o.expires}</div>
													</div>
													<div>
														<div> {o.lastCap.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {o.expires.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {o.expires.diff(now, 's')}</div>
													</div>
*/
