/**
 * @jxs React.DOM
 */

var Match = require('./Match.jsx');

module.exports = React.createClass({
	render: function() {

		return (
			<div className="RegionMatches">
				<h2>{this.props.data.label}</h2>
				{_.map(this.props.data.matches, function(match){
					return (
						<Match 
							className="match" 
							key={'match-' + match.wvw_match_id} 
							data={match} 
						/>
					);
				})}
			</div>
		);
	}
});