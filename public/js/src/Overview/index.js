"use strict";

/*
*
*   Dependencies
*
*/

const React        = require('react');
const Immutable    = require('Immutable');


/*
*   Data
*/

const DAO = require('lib/data/overview');


/*
*   React Components
*/

const Matches      = require('./Matches');
const Worlds       = require('./Worlds');





/*
*
*   Component Definition
*
*/

const propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

class Overview extends React.Component {

    /*
    *
    *     React Lifecycle
    *
    */

    constructor(props) {
        super(props);

        const dataListeners = {
            // regions     : this.onRegions.bind(this),
            // matchesByRegion: this.onMatchesByRegion.bind(this),
            // worldsByRegion : this.onWorldsByRegion.bind(this),
            onMatchData    : this.onMatchData.bind(this),
        };

        this.dao = new DAO(dataListeners);


        this.state = {
            regions: Immutable.fromJS({
                '1': {label: 'NA', id: '1'},
                '2': {label: 'EU', id: '2'}
            }),
            matchesByRegion: Immutable.fromJS({'1': {}, '2': {}}),
            worldsByRegion: this.dao.getWorldsByRegion(props.lang) //Immutable.fromJS({'1': {}, '2': {}})
        };
    }



    shouldComponentUpdate(nextProps, nextState) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);
        const newMatchData = !Immutable.is(this.state.matchesByRegion, nextState.matchesByRegion);
        const shouldUpdate = (newLang || newMatchData);

        // console.log('overview::shouldComponentUpdate()', {shouldUpdate, newLang, newMatchData});

        return shouldUpdate;
    }



    componentWillMount() {
        setPageTitle(this.props.lang);
        // setWorlds.call(this, this.props.lang);
    }



    componentDidMount() {
        this.dao.init(this.props.lang);
    }



    componentWillReceiveProps(nextProps) {
        if (!Immutable.is(nextProps.lang, this.props.lang)) {
            const worldsByRegion = this.dao.getWorldsByRegion(nextProps.lang);
            this.setState({worldsByRegion});

            setPageTitle(nextProps.lang);
        }
    }



    componentWillUnmount() {
        this.dao.close();
    }



    render() {
        return <div id="overview">

            <div className="row">{this.state.regions.map((region, regionId) =>
                <div className="col-sm-12" key={regionId}>
                    <Matches
                        region  = {region}
                        matches = {this.state.matchesByRegion.get(regionId)}
                        worlds  = {this.state.worldsByRegion.get(regionId)}
                    />
                </div>
            )}</div>

            <hr />

            <div className="row">{this.state.regions.map((region, regionId) =>
                <div className="col-sm-12" key={regionId}>
                    <Worlds
                        region = {region}
                        worlds = {this.state.worldsByRegion.get(regionId)}
                    />
                </div>
            )}</div>

        </div>;
    }



    /*
    *
    *   Data Listeners
    *
    */

    onMatchData(matchData) {
        const newMatchesByRegion = this.dao.getMatchesByRegion(matchData);

        this.setState(state => ({
            matchesByRegion: state.matchesByRegion.mergeDeep(newMatchesByRegion)
        }));
    }
}





/*
*
*   Direct DOM Manipulation
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
*   Export Module
*
*/

Overview.propTypes = propTypes;
module.exports     = Overview;
