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

import Emblem from './Emblem.jsx';
import Claims from './Claims.jsx';




/*
*
*	Component Definition
*
*/

class Guild extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !_.isEqual(this.props, nextProps);
	}



	render() {
		var props = this.props;

		return (
			<div className="guild" id={props.guild.guild_id}>
				<div className="row">

					<div className="col-sm-4">
						<Emblem guildName={props.guild.guild_name} />
					</div>

					<div className="col-sm-20">
						<h1>{props.guild.guild_name} [{props.guild.tag}]</h1>

						<Claims
							lang={props.lang}
							guild={props.guild}
						/>
					</div>

				</div>
			</div>
		);
	}
}



/*
*	Class Properties
*/

Guild.propTypes = {
	lang: React.PropTypes.object.isRequired,
	guild: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default Guild;
