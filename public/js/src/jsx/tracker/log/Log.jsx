/**
 * @jsx React.DOM
 */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Objective = require('./Objective.jsx');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			filter: null,
		};
	},

	render: function() {
		var objectives = this.props.objectives;
		var guilds = this.props.guilds;

		var log = _
			.chain(this.props.log)
			.sortBy('lastCap')
			.reverse()
			.value();

		var entries = _.map(log, function(entry, i) {
			return (
				<li key={'log-' + entry.logId} className="transition">
					<Objective
						entry={entry}
						entryIndex={entry.logId}
						objectives={objectives}
						guilds={guilds}
						key={i}
					/>
				</li>
			);
		});

		return (
			<ReactCSSTransitionGroup transitionName="log-entry" component={React.DOM.ul} className="list-unstyled" id="log">
				{entries}
			</ReactCSSTransitionGroup>
		);
	},
});
