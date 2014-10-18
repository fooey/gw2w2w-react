/**
 * @jxs React.DOM
 */

var Score = require('./Score.jsx');
var Pie = require('./Pie.jsx');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			scores: [NaN,NaN,NaN], 
			diff: [0,0,0]
		};
	},

	componentDidMount: function() {
		// console.log('Match::componentDidMount', this.props.data.wvw_match_id);

		this.updateTimer = null;
		this.getMatchDetails();

	},

	// componentWillUpdate: function(nextProps, nextState){
	// 	// console.log('Match::componentWillUpdate', this.props.data.wvw_match_id, nextState, this.state);

	// 	if (this.state.scores.length) {
	// 		$(this.getDOMNode()).addClass('highlight');
	// 	}

	// 	return;
	// },

	componentWillUnmount: function() {
		clearTimeout(this.updateTimer);
	},
	
	render: function() {
		// console.log('Match:render', this.props.data.wvw_match_id);

		var data = this.props.data;
		var worlds = require('../../staticData').worlds;

		var redWorld = worlds[data.red_world_id];
		var blueWorld = worlds[data.blue_world_id];
		var greenWorld = worlds[data.green_world_id];

		return (
			<div className="matchContainer">
				<table className="match">
					<tr>
						<td className="team red name"><a href={redWorld.link}>{redWorld.name}</a></td>
						<td className="team red score">
							<Score 
								key={'red-score-' + data.wvw_match_id}
								matchId={data.wvw_match_id}
								team="red"
								score={this.state.scores[0]} 
								diff={this.state.diff[0]}
							/>
						</td>
						<td rowSpan="3" className="pie">
							<Pie scores={this.state.scores} size="60" matchId={data.wvw_match_id} />
						</td>
					</tr>
					<tr>
						<td className="team blue name"><a href={blueWorld.link}>{blueWorld.name}</a></td>
						<td className="team blue score">
							<Score 
								key={'blue-score-' + data.wvw_match_id}
								matchId={data.wvw_match_id}
								team="blue"
								score={this.state.scores[1]} 
								diff={this.state.diff[1]}
							/>
						</td>
					</tr>
					<tr>
						<td className="team green name"><a href={greenWorld.link}>{greenWorld.name}</a></td>
						<td className="team green score">
							<Score 
								key={'green-score-' + data.wvw_match_id}
								matchId={data.wvw_match_id}
								team="green"
								score={this.state.scores[2]} 
								diff={this.state.diff[2]}
							/>
						</td>
					</tr>
				</table>
			</div>
		);
	},



	getMatchDetails: function() {
		var api = require('../../api');
		
		api.getMatchDetails(
			this.props.data.wvw_match_id,
			this.onMatchDetailsSuccess, 
			this.onMatchDetailsError, 
			this.onMatchDetailsComplete
		);
	},

	onMatchDetailsSuccess: function(data) {
		// console.log('Match::onMatchDetailsSuccess', this.props.data.wvw_match_id, data);
		this.setState({
			scores: data.scores,
			diff: [
				data.scores[0] - this.state.scores[0],
				data.scores[1] - this.state.scores[1],
				data.scores[2] - this.state.scores[2],
			]
		});
	},

	onMatchDetailsError: function(xhr, status, err) {
		console.log('Overview::getMatchDetails:data error', status, err.toString()); 
	},

	onMatchDetailsComplete: function(xhr, status, err) {
		var refreshTime = _.random(1000*16, 1000*32);
		this.updateTimer = setTimeout(this.getMatchDetails, refreshTime);
	},
});