'use strict';


/*
*	Dependencies
*/

var React = require('React');		// browserify shim
var _ = require('lodash');			// browserify shim
var numeral = require('numeral');	// browserify shim





/*
*	React Components
*/

var Sprite = require('./objectives/Sprite.jsx');





/*
*	Component Globals
*/

var staticData = require('gw2w2w-static');
var objectiveTypes = staticData.objective_types;





/*
*	Component Export
*/

module.exports = React.createClass({
	render: render,
});





/*
*
*	Component Methods
*
*/


/*
*	Component Lifecyle Methods
*/


function render() {
	var component = this;
	var props = component.props;

	var lang = props.lang;
	var matchWorlds = props.matchWorlds;

	return (
		<div className="row" id="scoreboards">{
			_.map(matchWorlds, function(mw, color) {
				var worldName = (mw.world) ? mw.world[lang.slug].name : color;
				var score = mw.score;
				var tick = mw.tick;
				var holdings = mw.holding;

				var scoreboardClass = [
					'scoreboard',
					'team-bg',
					'team',
					'text-center',
					color
				].join(' ');

				return (
					<div className="col-sm-8" key={color}>
						<div className={scoreboardClass}>

							{(mw.world) ?(
								<div>
									<h1>{worldName}</h1>
									<h2>{numeral(score).format('0,0')} +{tick}</h2>

									<ul className="list-inline">
										{_.map(holdings, function(holding, ixHolding) {
											var oType = objectiveTypes[ixHolding + 1];

											return (
												<li key={ixHolding}>
													<Sprite type={oType.name} color={color} />
													{' x' + holding}
												</li>
											);
										})}
									</ul>
								</div>
							) : (
								<h1 style={{height: '90px', fontSize: '32pt', lineHeight: '90px'}}>
									<i className="fa fa-spinner fa-spin"></i>
								</h1>
							)}


						</div>
					</div>
				);
			})
		}</div>
	);
}
