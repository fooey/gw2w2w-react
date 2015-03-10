'use strict';


/*
*
*	Dependencies
*
*/

const React = require('react');
const Immutable = require('Immutable');



/*
*	React Components
*/

const World = require('./World');




/*
*
*	Component Definition
*
*/

class Worlds extends React.Component {
	shouldComponentUpdate(nextProps) {
		const newLang = !Immutable.is(this.props.worlds, nextProps.worlds);
		const newRegion = !Immutable.is(this.props.region.get('worlds'), nextProps.region.get('worlds'));
		const shouldUpdate = (newLang || newRegion);

		// console.log('overview::RegionWorlds::shouldComponentUpdate()', shouldUpdate, newLang, newRegion);

		return shouldUpdate;
	}



	render() {
		const props = this.props;

		// console.log('overview::Worlds::render()', props.region.get('label'), props.region.get('worlds').toJS());

		return (
			<div className="RegionWorlds">
				<h2>{props.region.get('label')} Worlds</h2>
				<ul className="list-unstyled">
					{props.worlds.map(world =>
						<World
							key={world.get('id')}
							world={world}
						/>
					)}
				</ul>
			</div>
		);
	}
}



/*
*	Class Properties
*/

Worlds.propTypes = {
	region: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	worlds: React.PropTypes.instanceOf(Immutable.Seq).isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = Worlds;