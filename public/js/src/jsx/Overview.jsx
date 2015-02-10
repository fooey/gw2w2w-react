'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import Immutable from 'Immutable'; // browserify shim
import _ from 'lodash';

import api from '../api';



/*
*	React Components
*/

import RegionMatches from './overview/RegionMatches.jsx';
import RegionWorlds from './overview/RegionWorlds.jsx';


var regionsDefault = {
	"1": {
		"label": 'NA',
		"id": 1,
		"matches": [],
	},
	"2": {
		"label": 'EU',
		"id": 2,
		"matches": [],
	}
};




/*
*
*	Component Definition
*
*/

class Overview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			matches: Immutable.Map(),
			regions: Immutable.fromJS(regionsDefault),
		};

		this.updateTimer = null;

		setTimeout(this.getMatches.bind(this), 0);
	}



	shouldComponentUpdate(nextProps, nextState) {
		var props = this.props;
		var state = this.state;

		var newLang = !Immutable.is(props.lang, nextProps.lang);
		var newMatchData = !Immutable.is(state.matches, nextState.matches);

		var shouldUpdate = newLang || newMatchData;

		// console.log('Overview::shouldComponentUpdate()', shouldUpdate);

		return shouldUpdate;
	}



	componentWillUnmount() {
		clearTimeout(this.updateTimer);
	}



	componentDidUpdate() {
		setPageTitle(this.props.lang);
	}



	render() {
		var state = this.state;
		var props = this.props;

		// console.log('Overview::render()');

		return (
			<div id="overview">
				{<div className="row">
					{state.regions.map(region =>
						<div className="col-sm-12" key={region.get("label")}>
							<RegionMatches region={region} lang={props.lang} />
						</div>
					)}
				</div>}

				<hr />

				{<div className="row">
					{state.regions.map(region =>
						<div className="col-sm-12" key={region.get("label")}>
							<RegionWorlds region={region} lang={props.lang} />
						</div>
					)}
				</div>}
			</div>
		);
	}



	getMatches() {
		var component = this;

		api.getMatches((err, matchData) => {
			if (!err && matchData && !_.isEmpty(matchData)) {

				var matches = component.state.matches
					.mergeDeep(matchData)
					.sort((a,b) => {return a.id - b.id;});


				var regions = this.getRegions(matches);


				component.setState({
					matches,
					regions,
				});

			}


			component.updateTimer = setTimeout(
				component.getMatches.bind(component),
				_.random(2000, 4000)
			);
		});
	}



	getRegions(matches) {
		var state = this.state;

		var regions = state.regions;
		regions = regions.setIn(["1", "matches"], matches.filter(match => _.parseInt(match.get("region")) === 1));
		regions = regions.setIn(["2", "matches"], matches.filter(match => _.parseInt(match.get("region")) === 2));

		return regions;
	}
}



/*
*	Class Properties
*/

Overview.propTypes = {
	lang: React.PropTypes.object.isRequired,
};




/*
*
*	Export Module
*
*/

export default Overview;




/*
*
*	Private Methods
*
*/


function setPageTitle(lang) {
	var title = ['gw2w2w'];

	if (lang && lang.slug !== 'en') {
		title.push(lang.name);
	}

	$('title').text(title.join(' - '));
}
