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

const MapDetails = require('./MapDetails');
const Log = require('Tracker/Log');




/*
*
*	Component Definition
*
*/

class Maps extends React.Component {
	shouldComponentUpdate(nextProps) {
		const newLang = !Immutable.is(this.props.lang, nextProps.lang);
		const newGuilds = !Immutable.is(this.props.guilds, nextProps.guilds);
		const newDetails = !Immutable.is(this.props.details, nextProps.details);
		const newWorlds = !Immutable.is(this.props.matchWorlds, nextProps.matchWorlds);

		const shouldUpdate = (newLang || newGuilds || newDetails || newWorlds);

		return shouldUpdate;
	}



	render() {
		const props = this.props;

		const isDataInitialized = props.details.get('initialized');

		if (!isDataInitialized) {
			return null;
		}


		return (
			<section id="maps">
				<div className="row">

					<div className="col-md-6">{<MapDetails mapKey="Center" {...props} />}</div>

					<div className="col-md-18">

						<div className="row">
							<div className="col-md-8">{<MapDetails mapKey="RedHome" {...props} />}</div>
							<div className="col-md-8">{<MapDetails mapKey="BlueHome" {...props} />}</div>
							<div className="col-md-8">{<MapDetails mapKey="GreenHome" {...props} />}</div>
						</div>

						<div className="row">
							<div className="col-md-24">
								<Log {...props} />
							</div>
						</div>

					</div>
				 </div>
			</section>
		);
	}
}



/*
*	Class Properties
*/

Maps.propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	details: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	matchWorlds: React.PropTypes.instanceOf(Immutable.List).isRequired,
	guilds: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};




/*
*
*	Export Module
*
*/

module.exports = Maps;
