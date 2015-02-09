'use strict';


/*
*
*	Dependencies
*
*/

import React from 'React'; // browserify shim
import Immutable from 'immutable';
import _ from 'lodash';

import api from '../api';



/*
*	React Components
*/

import RegionMatches from './overview/RegionMatches.jsx';
import RegionWorlds from './overview/RegionWorlds.jsx';





/*
*
*	Component Definition
*
*/

class Overview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			matches: {},
			regions: [],
		};

		this.updateTimer = null;

		this.getMatches();
	}



	shouldComponentUpdate(nextProps, nextState) {
		var shouldUpdate = !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
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
				<div className="row">
					{state.regions.map(region => {
						return <div className="col-sm-12" key={region.label}>
							<RegionMatches region={region} {...props} />
						</div>;
					})}
				</div>

				<hr />

				<div className="row">
					{state.regions.map(region =>
						<div className="col-sm-12" key={region.label}>
							<RegionWorlds region={region} {...props} />
						</div>
					)}
				</div>
			</div>
		);
	}



	getMatches() {
		var component = this;

		api.getMatches((err, data) => {
			if (!err && data && !_.isEmpty(data)) {

				component.setState({
					matches: data,
					regions: getRegions(data),
				});

			}

			component.updateTimer = setTimeout(
				component.getMatches.bind(component),
				_.random(2000, 4000)
			);
		});
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

function getRegions(matches) {
	return [
		{
			'label': 'NA',
			'id': '1',
			'matches': _.filter(matches, match => _.parseInt(match.region) === 1),
		}, {
			'label': 'EU',
			'id': '2',
			"matches": _.filter(matches, match => _.parseInt(match.region) === 2),
		},
	];
}



function setPageTitle(lang) {
	var title = ['gw2w2w'];

	if (lang && lang.slug !== 'en') {
		title.push(lang.name);
	}

	$('title').text(title.join(' - '));
}
