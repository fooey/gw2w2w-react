"use strict";

/*
*
* Dependencies
*
*/

const React        = require('react');
const Immutable    = require('Immutable');

const DataProvider = require('lib/data/overview');


/*
* React Components
*/

const Matches      = require('./Matches');
const Worlds       = require('./Worlds');





/*
*
* Component Definition
*
*/

const propTypes = {
    lang: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

class Overview extends React.Component {
    constructor(props) {
        super(props);

        this.dataProvider = new DataProvider(this);

        this.state = this.dataProvider.getDefaults(props.lang);
    }



    shouldComponentUpdate(nextProps, nextState) {
        const newLang      = !Immutable.is(this.props.lang, nextProps.lang);
        const newMatchData = !Immutable.is(this.state.matchesByRegion, nextState.matchesByRegion);
        const shouldUpdate = (newLang || newMatchData);

        // console.log('overview::shouldComponentUpdate()', {shouldUpdate, newLang, newMatchData});

        return shouldUpdate;
    }



    componentWillMount() {
        setPageTitle.call(this, this.props.lang);
        // setWorlds.call(this, this.props.lang);
    }



    componentDidMount() {
        this.dataProvider.init(this.props.lang);
    }



    componentWillReceiveProps(nextProps) {
        if (!Immutable.is(nextProps.lang, this.props.lang)) {
            setPageTitle.call(this, nextProps.lang);
            this.dataProvider.setLang(nextProps.lang);
        }
    }



    componentWillUnmount() {
        this.dataProvider.close();
    }



    render() {
        return <div id="overview">
            <div className="row">
                {this.state.regions.map((region, regionId) =>
                    <div className="col-sm-12" key={regionId}>
                        <Matches
                            region  = {region}
                            matches = {this.state.matchesByRegion.get(regionId)}
                            worlds  = {this.state.worldsByRegion.get(regionId)}
                        />
                    </div>
                )}
            </div>

            <hr />

            <div className="row">
                {this.state.regions.map((region, regionId) =>
                    <div className="col-sm-12" key={regionId}>
                        <Worlds
                            region = {region}
                            worlds = {this.state.worldsByRegion.get(regionId)}
                        />
                    </div>
                )}
            </div>
        </div>;
    }
}




/*
*
* Private Methods
*
*/





/*
*
* Direct DOM Manipulation
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
* Export Module
*
*/

Overview.propTypes = propTypes;
module.exports     = Overview;
