'use strict';

/*
*
*	Dependencies
*
*/

import React from 'React';		// browserify shim
import $ from 'jquery';			// browserify shim

import _ from 'lodash';

import STATIC from 'gw2w2w-static';




/*
*	React Components
*/

import MapScores from './MapScores.jsx';
import MapSection from './MapSection.jsx';





/*
*
*	Component Definition
*
*/

class MapDetails extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		var mapMeta = _.find(STATIC.objective_map, {key: props.mapKey});

		return (
			<div className="map">

				<div className="mapScores">
					<h2 className={'team ' + mapMeta.colo} onClick={onTitleClick}>
						{mapMeta.name}
					</h2>
					<MapScores scores={props.details.maps.scores[mapMeta.mapIndex]} />
				</div>

				<div className="row">
					{_.map(mapMeta.sections, (mapSection, ixSection) => {

						let sectionClass = getSectionClass(mapMeta.key, mapSection.label);

						return (
							<MapSection
								key={ixSection}
								className={sectionClass}
								mapSection={mapSection}
								{...props}
							/>
						);
					})}
				</div>


			</div>
		);
	}
}



/*
*	Class Properties
*/

MapDetails.propTypes = {
	lang: React.PropTypes.object.isRequired,
	libAudio: React.PropTypes.object.isRequired,
	options: React.PropTypes.object.isRequired,
	details: React.PropTypes.object.isRequired,
	matchWorlds: React.PropTypes.object.isRequired,
	guilds: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default MapDetails;





/*
*
*	Private Methods
*
*/

function onTitleClick(e) {
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
