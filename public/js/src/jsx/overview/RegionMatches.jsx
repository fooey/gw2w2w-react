/**
 * @jxs React.DOM
 */

var Match = React.createFactory(require('./Match.jsx'));

module.exports = React.createClass({
	render: function() {

		var region = this.props.region;
		var worlds = this.props.worlds;

		return (
			<div className="RegionMatches">
				<h2>{region.label}</h2>
				{_.map(region.matches, function(match){
					return (
						<Match 
							key={'match-' + match.id} 
							className="match" 
							match={match} 
							worlds={worlds} 
						/>
					);
				})}
			</div>
		);
	}
});