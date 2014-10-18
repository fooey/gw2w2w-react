/**
 * @jsx React.DOM
 */

var MapDetails = require('./MapDetails.jsx');
var libDate = require('../../lib/date.js');

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
				<div className="row">{
					_.map(mapsConfig, function(mapConfig, outputIndex) {

						var mapName = mapNames[outputIndex];
						var mapColor = mapColors[outputIndex];

						return (
							<div className="col-md-6" key={'map-' + mapConfig.mapIndex}>
								<MapDetails 
									mapsScores={mapsScores[mapConfig.mapIndex]}
									objectives={objectives}
									guilds={guilds}
									mapConfig={mapConfig}
									mapName={mapName}
									mapColor={mapColor}
									dateNow={dateNow}
								/>
							</div>
						);
					})
				}</div>
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