"use strict";

/*
*
*	Dependencies
*
*/

const React		= require('react');
const Immutable	= require('Immutable');

const api		= require('lib/api');
const STATIC	= require('lib/static');



/*
*	React Components
*/

const Matches	= require('./Matches');
const Worlds	= require('./Worlds');





/*
*
*	Component Definition
*
*/

const propTypes = {
	lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

class Overview extends React.Component {
	constructor(props) {
		super(props);

		this.mounted = true;
		this.timeouts = {};

		this.state = {
			regions: Immutable.fromJS({
				'1': {label: 'NA', id: '1'},
				'2': {label: 'EU', id: '2'}
			}),

			matchesByRegion	: Immutable.fromJS({'1': {}, '2': {}}),
			worldsByRegion	: Immutable.fromJS({'1': {}, '2': {}})
		};
	}



	shouldComponentUpdate(nextProps, nextState) {
		const newLang		= !Immutable.is(this.props.lang, nextProps.lang);
		const newMatchData	= !Immutable.is(this.state.matchesByRegion, nextState.matchesByRegion);
		const shouldUpdate	= (newLang || newMatchData);

		// console.log('overview::shouldComponentUpdate()', {shouldUpdate, newLang, newMatchData});

		return shouldUpdate;
	}



	componentWillMount() {
		setPageTitle.call(this, this.props.lang);
		setWorlds.call(this, this.props.lang);

		getData.call(this);
	}



	componentWillReceiveProps(nextProps) {
		setPageTitle.call(this, nextProps.lang);
		setWorlds.call(this, nextProps.lang);
	}



	componentWillUnmount() {
		this.mounted = false;
		clearTimeout(this.timeouts.matchData);
	}



	render() {
		return <div id="overview">
			<div className="row">
				{this.state.regions.map((region, regionId) =>
					<div className="col-sm-12" key={regionId}>
						<Matches
							region	= {region}
							matches	= {this.state.matchesByRegion.get(regionId)}
							worlds	= {this.state.worldsByRegion.get(regionId)}
						/>
					</div>
				)}
			</div>

			<hr />

			<div className="row">
				{this.state.regions.map((region, regionId) =>
					<div className="col-sm-12" key={regionId}>
						<Worlds
							region	= {region}
							worlds	= {this.state.worldsByRegion.get(regionId)}
						/>
					</div>
				)}
			</div>
		</div>;
	}
}




/*
*
*	Private Methods
*
*/





/*
*
*	Direct DOM Manipulation
*
*/

function setPageTitle(lang) {
	let title = ['gw2w2w.com'];

	if (lang.get('slug') !== 'en') {
		title.push(lang.get('name'));
	}

	$('title').text(title.join(' - '));
}




/*
*
*	Data
*
*/



/*
*	Data - Worlds
*/

function setWorlds(lang) {
	let self = this;

	const newWorldsByRegion = Immutable
		.Seq(STATIC.worlds)
		.map(world => getWorldByLang(lang, world))
		.sortBy(world => world.get('name'))
		.groupBy(world => world.get('region'));

	self.setState({worldsByRegion: newWorldsByRegion});
}



function getWorldByLang(lang, world) {
	const langSlug = lang.get('slug');

	const worldByLang = world.get(langSlug);

	const region = world.get('region');
	const link = getWorldLink(langSlug, worldByLang);

	return worldByLang.merge({link, region});
}



function getWorldLink(langSlug, world) {
	return ['', langSlug, world.get('slug')].join('/');
}



/*
*	Data - Matches
*/

function getData() {
	let self = this;
	// console.log('overview::getData()');

	api.getMatches((err, data) => {
		const matchData = Immutable.fromJS(data);

		if (self.mounted) {
			if (!err && matchData && !matchData.isEmpty()) {
				self.setState(getMatchesByRegion.bind(self, matchData));
			}

			setDataTimeout.call(self);
		}
	});
}



function getMatchesByRegion(matchData, state) {
	const newMatchesByRegion = Immutable
		.Seq(matchData)
		.groupBy(match => match.get("region").toString());

	return {matchesByRegion: state.matchesByRegion.mergeDeep(newMatchesByRegion)};
}



function setDataTimeout() {
	let self = this;

	self.timeouts.matchData = setTimeout(
		getData.bind(self),
		getInterval()
	);
}



function getInterval() {
	return randRange(2000, 4000);
}


function randRange(min, max) {
	return Math.random() * ((max - min) + min);
}





/*
*
*	Export Module
*
*/

Overview.propTypes	= propTypes;
module.exports		= Overview;
