'use strict';

/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim

import _ from 'lodash';

import STATIC from 'gw2w2w-static';



/*
*	React Components
*/

import Entry from './Entry.jsx';




/*
*
*	Component Definition
*
*/

class LogEntries extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !_.isEqual(this.props, nextProps);
	}



	render() {
		var props = this.props;

		return (
			<ul className="list-unstyled" id="log">
				{_.map(props.eventHistory, entry => {

					var guildId, guild;

					if (entry.type === 'claim') {
						guildId = entry.guild;
						guild = (props.guilds && guildId && _.has(props.guilds, guildId))
							? props.guilds[guildId]
							: null;
					}

					return <Entry
						key={entry.id}
						lang={props.lang}
						triggerNotification={props.triggerNotification}
						libAudio={props.libAudio}
						options={props.options}

						entry={entry}
						guild={guild}
					/>;
				})}
			</ul>
		);
	}
}



/*
*	Class Properties
*/

LogEntries.defaultProps = {
	guilds: {},
};

LogEntries.propTypes = {
	lang: React.PropTypes.object.isRequired,
	triggerNotification: React.PropTypes.bool.isRequired,
	guilds: React.PropTypes.object.isRequired,
	libAudio: React.PropTypes.object.isRequired,
	options: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default LogEntries;
