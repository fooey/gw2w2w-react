/**
 * @jsx React.DOM
 */

var MapSection = React.createFactory(require('./MapSection.jsx'));

var libDate = require('../../lib/date.js');
var staticData = require('gw2w2w-static');

var objectivesData = staticData.objectives;
var colorMap = ['red', 'green', 'blue'];

module.exports = React.createClass({

	render: function() {
		var dateNow = this.props.dateNow;
		var details = this.props.details;
		var guilds = this.props.guilds;
		var matchWorlds = this.props.matchWorlds;
		var mapsMeta = this.props.mapsMeta;
		var mapIndex = this.props.mapIndex;

		var owners = details.objectives.owners;
		var claimers = details.objectives.claimers;

		var scores = _.map(details.maps.scores[mapIndex], function(score) {return numeral(score).format('0,0');});
		var ticks = details.maps.ticks[mapIndex];
		var holdings = details.maps.holdings[mapIndex];

		// var mapConfig = this.props.mapConfig;
		// var mapScores = this.props.mapsScores[mapConfig.mapIndex];
		// var mapName = this.props.mapName;
		// var mapColor = this.props.mapColor;


		var metaIndex = [3,0,2,1]; // output in different order than original data

		var mapMeta = mapsMeta[metaIndex[mapIndex]];
		var mapName = mapMeta.name;
		var mapColor = mapMeta.color;
		var mapConfig = staticData.objective_map[mapIndex];

		return (
			<div className="map">

				<div className="mapScores">
					<h2 className={'team ' + mapColor} onClick={this.onTitleClick}>
						{mapName}
					</h2>
					<ul className="list-inline">{
						_.map(scores, function(score, scoreIndex) {
							return (
								<li key={'map-score-' + scoreIndex} className={getScoreClass(scoreIndex)}>
									{score}
								</li>
							);
						})
					}</ul>
				</div>

				<div className="row">
					{_.map(mapConfig.sections, function(mapSection, secIndex) {

						var sectionClass = [
							'col-md-24',
							'map-section',
						];

						if (mapConfig.key === 'Center') {
							if (mapSection.label === 'Castle') {
								sectionClass.push('col-sm-24');
							}
							else {
								sectionClass.push('col-sm-8');
							}
						}
						else {
							sectionClass.push('col-sm-8');
						}

						return (
							<div className={sectionClass.join(' ')} key={mapConfig.key + '-' + mapSection.label}>
								<MapSection
									dateNow={dateNow}
									mapSection={mapSection}
									owners={owners}
									claimers={claimers}
									guilds={guilds}
								/>
							</div>
						);
					})}
				</div>


			</div>
		);
	},

	/*


				<div className="row">
					{_.map(mapConfig.sections, function(mapSection, secIndex) {

						var sectionClass = [
							'col-md-24',
							'map-section',
						];

						if (mapConfig.key === 'Center') {
							if (mapSection.label === 'Castle') {
								sectionClass.push('col-sm-24');
							}
							else {
								sectionClass.push('col-sm-8');
							}
						}
						else {
							sectionClass.push('col-sm-8');
						}

						return (
							<div className={sectionClass.join(' ')} key={mapConfig.key + '-' + mapSection.label}>
								<MapSection
									dateNow={dateNow}
									mapSection={mapSection}
									objectives={objectives}
									guilds={guilds}
								/>
							</div>
						);
					})}
				</div>
	*/

	onTitleClick: function(e) {
		var $maps = $('.map');
		var $map = $(e.target).closest('.map', $maps);

		var hasFocus = $map.hasClass('map-focus');


		if(!hasFocus) {
			$map
				.addClass('map-focus')
				.removeClass('map-blur');

			$maps.not($map)
				.removeClass('map-focus')
				.addClass('map-blur');
		}
		else {
			$maps
				.removeClass('map-focus')
				.removeClass('map-blur');

		}
	},
});


function getScoreClass(scoreIndex) {
 return ['team', colorMap[scoreIndex]].join(' ');
}


/*


				<ul className="objectives list-unstyled">
					{_.map(mapDetails.objectives, function(o, oIndex) {
						var objectiveMeta = objectivesData.objective_meta[o.id];
						var objectiveName = objectivesData.objective_names[o.id];
						var objectiveLabels = objectivesData.objective_labels[o.id];

						var timerActive = (o.expires >= dateNow);
						var timerUnknown = (o.lastCap === window.app.state.start);
						var expiration = moment((o.expires - dateNow) * 1000);

						// console.log(o.lastCap, o.expires, now, o.expires > now);

						var className = [
							'objective',
							'team', 
							o.owner.toLowerCase(),
						].join(' ');

						var timerClass = [
							'timer',
							(timerActive) ? 'active' : 'inactive',
							(timerUnknown) ? 'unknown' : '',
						].join(' ');

						if (objectiveMeta) {
							return (
								<li className={className} key={'objective-' + o.id} id={'objective-' + o.id}>
									<span className="objective-label">{objectiveLabels[appState.lang.slug]} </span>

									<span className={timerClass} title={'Expires at ' + o.expires}>{expiration.format('m:ss')}</span>
								</li>
							);
						}
					})}
				</ul>



				<ul className="objectives list-unstyled">
					{_.map(mapDetails.objectives, function(o, oIndex) {
						var objectiveMeta = objectivesData.objective_meta[o.id];
						var objectiveName = objectivesData.objective_names[o.id];
						var objectiveLabels = objectivesData.objective_labels[o.id];

						var timerActive = (o.expires >= dateNow);
						var timerUnknown = (o.lastCap === window.app.state.start);
						var expiration = moment((o.expires - dateNow) * 1000);

						// console.log(o.lastCap, o.expires, now, o.expires > now);

						var className = [
							'objective',
							'team', 
							o.owner.toLowerCase(),
						].join(' ');

						var timerClass = [
							'timer',
							(timerActive) ? 'active' : 'inactive',
							(timerUnknown) ? 'unknown' : '',
						].join(' ');

						if (objectiveMeta) {
							return (
								<li className={className} key={'objective-' + o.id} id={'objective-' + o.id}>
									<span className="objective-label">{objectiveLabels[appState.lang.slug]} </span>

									<span className={timerClass} title={'Expires at ' + o.expires}>{expiration.format('m:ss')}</span>
								</li>
							);
						}
					})}
				</ul>
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