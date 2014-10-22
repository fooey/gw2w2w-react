/**
 * @jsx React.DOM
 */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Sprite = require('../Sprite.jsx');
var Arrow = require('../Arrow.jsx');
var libDate = require('../../../lib/date.js');

module.exports = React.createClass({

	getInitialState: function() {
		return {dateNow: libDate.dateNow()};
	},
	tick: function() {
		this.setState({dateNow: libDate.dateNow()});
	},
	componentDidMount: function() {
		this.interval = setInterval(this.tick, 1000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},

	render: function() {
		var staticData = require('../../../staticData');
		var objectivesData = staticData.objectives;

		var appState = window.app.state;

		var entryIndex = this.props.entryIndex;
		var entry = this.props.entry;
		var objective = entry.objective;
		var objectives = this.props.objectives;
		var guilds = this.props.guilds;


		if (!objectivesData.objective_meta[objective.id]) {
			// console.log(objective.id, 'not in', objectivesData.objective_meta);
			// short circuit
			return null;
		}


		// var objective = objectives[objective];
		var objectiveMeta = objectivesData.objective_meta[objective.id];
		var objectiveName = objectivesData.objective_names[objective.id];
		var objectiveLabels = objectivesData.objective_labels[objective.id];
		var objectiveType = objectivesData.objective_types[objectiveMeta.type];

		var timestamp = moment(entry.timestamp * 1000);

		var className = [
			'objective',
			'team', 
			objective.owner.toLowerCase(),
		].join(' ');

		return (
			<div className={className} key={entryIndex}>
				<div className="objective-relative">
					<span>{timestamp.twitterShort()}</span>
				</div>
				<div className="objective-timestamp">
					{timestamp.format('hh:mm:ss')}
				</div>
				<div className="objective-icons">
					<Arrow objectiveMeta={objectiveMeta} />
 					<Sprite type={objectiveType.name} color={objective.owner.toLowerCase()} />
				</div>
				<div className="objective-label">
					<span>{objectiveLabels[appState.lang.slug]}</span>
				</div>
				<div className="objective-guild">
					{renderGuild(objective.owner_guild, guilds)}
				</div>
			</div>
		);
	},
});

function renderGuild(guildId, guilds) {
	if (!guildId) {
		return null;
	}
	else {
		var guild = guilds[guildId];

		var guildClass = [
			'guild',
			'name',
			'pending'
		].join(' ');

		if(!guild) {
			return <span className={guildClass}><i className="fa fa-spinner fa-spin"></i></span>;
		}
		else {
			return <span className={guildClass}>{guild.guild_name} [{guild.tag}]</span>;
		}
	}
}


function getArrow(meta) {
	if (!meta.d) {
		return null;
	}
	else {
		var src = ['/img/icons/dist/arrow'];

		if (meta.n) {src.push('north'); }
		else if (meta.s) {src.push('south'); }

		if (meta.w) {src.push('west'); }
		else if (meta.e) {src.push('east'); }

		return <img src={src.join('-') + '.svg'} />;

	}
}


/*

													<div>
														<div>now: {now}</div>
														<div>cap: {objective.lastCap}</div>
														<div>exp: {objective.expires}</div>
													</div>
													<div>
														<div> {objective.lastCap.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {objective.expires.format('YYYY-MM-DD HH:mm:ss')}</div>
														<div> {objective.expires.diff(now, 's')}</div>
													</div>
*/