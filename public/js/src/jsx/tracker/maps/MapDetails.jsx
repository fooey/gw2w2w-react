'use strict';

/*
*	Dependencies
*/

var React = require('React');		// browserify shim
var _ = require('lodash');			// browserify shim
var $ = require('jquery');			// browserify shim
var numeral = require('numeral');	// browserify shim





/*
*	React Components
*/

var MapSection = require('./MapSection.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var mapsStatic = staticData.objective_map;





/*
*	Component Export
*/

module.exports = React.createClass({
	render: render,

	onTitleClick: onTitleClick,
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

	var lang = props.lang;
	var details = props.details;
	var guilds = props.guilds;
	var matchWorlds = props.matchWorlds;
	var mapsMeta = props.mapsMeta;
	var mapKey = props.mapKey;

	var owners = details.objectives.owners;
	var claimers = details.objectives.claimers;


	var mapMeta = _.find(mapsStatic, {key: mapKey});
	var scores = _.map(details.maps.scores[mapMeta.mapIndex], function(score) {return numeral(score).format('0,0');});
	// var ticks = details.maps.ticks[mapMeta.mapIndex];
	// var holdings = details.maps.holdings[mapMeta.mapIndex];


	return (
		<div className="map">

			<div className="mapScores">
				<h2 className={'team ' + mapMeta.colo} onClick={component.onTitleClick}>
					{mapMeta.name}
				</h2>
				<ul className="list-inline">{
					_.map(scores, function(score, ixScore) {
						return (
							<li key={ixScore} className={getScoreClass(ixScore)}>
								{score}
							</li>
						);
					})
				}</ul>
			</div>

			<div className="row">
				{_.map(mapMeta.sections, function(mapSection, ixSection) {

					var sectionClass = getSectionClass(mapMeta.key, mapSection.label);

					return (
						<div className={sectionClass} key={ixSection}>
							<MapSection
								lang={lang}

								mapSection={mapSection}
								owners={owners}
								claimers={claimers}
								guilds={guilds}
								mapMeta={mapMeta}
							/>
						</div>
					);
				})}
			</div>


		</div>
	);
}





/*
*	Component Helper Methods
*/

function onTitleClick(e) {
	var component = this;

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
}





/*
*
*	Private Methods
*
*/

var colorMap = ['red', 'green', 'blue'];
function getScoreClass(ixScore) {
	return ['team', colorMap[ixScore]].join(' ');
}



function getSectionClass(mapKey, sectionLabel) {
	var sectionClass = [
		'col-md-24',
		'map-section',
	];

	if (mapKey === 'Center') {
		if (sectionLabel === 'Castle') {
			sectionClass.push('col-sm-24');
		}
		else {
			sectionClass.push('col-sm-8');
		}
	}
	else {
		sectionClass.push('col-sm-8');
	}

	return sectionClass.join(' ');
}
