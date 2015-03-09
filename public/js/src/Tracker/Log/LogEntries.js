'use strict';

/*
*
*	Dependencies
*
*/

const React = require('react');
const Immutable = require('Immutable');

const STATIC = require('gw2w2w-static');



/*
*	React Components
*/

const Entry = require('./Entry');




/*
*
*	Component Definition
*
*/

class LogEntries extends React.Component {
	shouldComponentUpdate(nextProps) {
		const newLang = !Immutable.is(this.props.lang, nextProps.lang);
		const newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);

		const newTriggerState = !Immutable.is(this.props.triggerNotification, nextProps.triggerNotification);
		const newFilterState = !Immutable.is(this.props.mapFilter, nextProps.mapFilter) || !Immutable.is(this.props.eventFilter, nextProps.eventFilter);

		const shouldUpdate = (
			newLang
			|| newGuilds
			|| newTriggerState
			|| newFilterState
		);

		return shouldUpdate;
	}



	render() {
		const props = this.props;

		// console.log('LogEntries::render()', props.mapFilter, props.eventFilter, props.triggerNotification);

		return (
			<ul id="log">
				{props.eventHistory.map(entry => {
					const eventType = entry.get('type');
					const entryId = entry.get('id');
					let guildId, guild;

					if (eventType === 'claim') {
						guildId = entry.get('guild');
						guild = (props.guilds.has(guildId))
							? props.guilds.get(guildId)
							: null;
					}


					return <Entry
						key={entryId}
						component='li'

						triggerNotification={props.triggerNotification}
						mapFilter={props.mapFilter}
						eventFilter={props.eventFilter}

						lang={props.lang}

						guildId={guildId}
						entry={entry}
						guild={guild}
					/>;
				})}
			</ul>
		);
	}


	// componentDidUpdate() {
	// 	$(React.findDOMNode(this))
	// 		.children('li')
	// 			.filter('.show-entry')
	// 				.each((ixRow, el) => (ixRow % 2) ? $(el).addClass('to-alt') : null)
	// 			.end()
	// 			.filter('.alt:not(.to-alt)')
	// 				.removeClass('alt')
	// 			.end()
	// 			.filter('.to-alt')
	// 				.addClass('alt')
	// 				.removeClass('to-alt')
	// 			.end()
	// 		.end();
	// }
}



/*
*	Class Properties
*/

LogEntries.defaultProps = {
	guilds: {},
};

LogEntries.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired,

	triggerNotification: React.PropTypes.bool.isRequired,
	mapFilter: React.PropTypes.string.isRequired,
	eventFilter: React.PropTypes.string.isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = LogEntries;
