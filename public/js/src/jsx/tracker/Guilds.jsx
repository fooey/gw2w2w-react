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

import Guild from './guilds/Guild.jsx';




/*
*
*	Component Definition
*
*/

class Guilds extends React.Component {
	constructor() {
		this.state = {
			animateEntry: false,	// don't animate on initial load
		};
	}



	componentDidMount() {
		var component = this;

		component.setState({animateEntry: true});
	}



	shouldComponentUpdate(nextProps, nextState) {
		var shouldUpdate = (
			!_.isEqual(this.props, nextProps)
			|| !_.isEqual(this.state, nextState)
		);

		return shouldUpdate;
	}



	render() {
		var props = this.props;
		var state = this.state;

		// console.log('Guilds::render()');

		var guildClaims = _.chain(_.merge({}, props.guilds))
			.map(guild => {
				guild.claims = _.chain(props.claimEvents)
					.filter(entry => entry.guild === guild.guild_id)
					.sortBy('timestamp')
					.reverse()
					.value();

				guild.lastClaim = (guild.claims && guild.claims.length) ? guild.claims[0].timestamp : 0;

				guild.key = `${guild.guild_id}@${guild.lastClaim}`;

				return guild;
			})
			.sortBy('guild_name')
			.sortBy(function(guild){
				return -guild.lastClaim;
			})
			.value();


		return (
			<section id="guilds">
				<h2 className="section-header">Guild Claims</h2>
				{_.map(guildClaims, guild =>
					<Guild
						{...props}
						key={guild.key}

						animateEntry={state.animateEntry}
						guild={guild}
					/>
				)}
			</section>
		);
	}
}



/*
*	Class Properties
*/

Guilds.propTypes = {
	lang: React.PropTypes.object.isRequired,
	guilds: React.PropTypes.object.isRequired,
	claimEvents: React.PropTypes.array.isRequired,
};




/*
*
*	Export Module
*
*/

export default Guilds;
