'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import numeral from 'numeral';	// browserify shim

import _ from 'lodash';





/*
*	React Components
*/

import Holdings from './Holdings.jsx';




/*
*
*	Component Definition
*
*/

class World extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		return (
			<div className="col-sm-8">
				<div className={getClassName(props.color)}>

					{(hasWorldData(props.matchWorld))
						? <div>

							<h1>{getWorldName(props.matchWorld.world, props.lang.slug, props.color)}</h1>
							<h2>{getFormattedScore(props.matchWorld.score, props.matchWorld.tick)}</h2>

							<Holdings color={props.color} holdings={props.matchWorld.holding} />

						</div>
						: <h1 style={{height: '90px', fontSize: '32pt', lineHeight: '90px'}}>
							<i className="fa fa-spinner fa-spin"></i>
						</h1>
					}

				</div>
			</div>
		);
	}
}



/*
*	Class Properties
*/

World.propTypes = {
	lang: React.PropTypes.object.isRequired,
	matchWorld: React.PropTypes.object.isRequired,
	color: React.PropTypes.string.isRequired,
};




/*
*
*	Export Module
*
*/

export default World;




/*
*
*	Private Methods
*
*/

function hasWorldData(matchWorld) {
	return matchWorld && matchWorld.world;
}



function getWorldName(world, langSlug, color) {
	return (world)
		? world[langSlug].name
		: color;
}



function getClassName(color) {
	return `${color} scoreboard team-bg team text-center`;
}



function getFormattedScore(score, tick) {
	var formattedScore = numeral(score).format('0,0');
	var formattedTick = numeral(tick).format('+0,0');
	return `${formattedScore} ${formattedTick}`;
}
