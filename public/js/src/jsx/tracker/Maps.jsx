'use strict';


/*
*
*	Dependencies
*
*/


import React from 'React'; // browserify shim
import _ from 'lodash';
// import STATIC from 'gw2w2w-static';



/*
*	React Components
*/

import MapDetails from './maps/MapDetails.jsx';
import Log from './log/Log.jsx';




/*
*
*	Component Definition
*
*/

class Maps extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !_.isEqual(this.props, nextProps);
	}

	render() {
		var props = this.props;

		if (!props.details.initialized) {
			return null;
		}


		return (
			<section id="maps">
				<div className="row">

					<div className="col-md-6"><MapDetails mapKey="Center" {...props} /></div>

					<div className="col-md-18">

						<div className="row">
							<div className="col-md-8"><MapDetails mapKey="RedHome" {...props} /></div>
							<div className="col-md-8"><MapDetails mapKey="BlueHome" {...props} /></div>
							<div className="col-md-8"><MapDetails mapKey="GreenHome" {...props} /></div>
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
	lang: React.PropTypes.object.isRequired,
	libAudio: React.PropTypes.object.isRequired,
	details: React.PropTypes.object.isRequired,

	options: React.PropTypes.object,
	matchWorlds: React.PropTypes.object,
	guilds: React.PropTypes.object,
};




/*
*
*	Export Module
*
*/

export default Maps;
