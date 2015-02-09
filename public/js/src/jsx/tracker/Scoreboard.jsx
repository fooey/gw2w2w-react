'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim

import _ from 'lodash';





/*
*	React Components
*/

import WorldScoreboard from './scoreboard/World.jsx';




/*
*
*	Component Definition
*
*/

class Scoreboard extends React.Component {
	shouldComponentUpdate(nextProps) {return !_.isEqual(this.props, nextProps);}

	render() {
		var props = this.props;

		return (
			<section className="row" id="scoreboards">
				{_.map(props.matchWorlds, (mw, color) =>
					<WorldScoreboard
						key={color}
						matchWorld={mw}
						color={color}
						lang={props.lang}
					/>
				)}
			</section>
		);
	}
}



/*
*	Class Properties
*/

Scoreboard.propTypes = {
	lang: React.PropTypes.object.isRequired,
	matchWorlds: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default Scoreboard;
