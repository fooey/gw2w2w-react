
/*
*
*   Dependencies
*
*/

import React from'react';
import { connect } from 'react-redux';


/*
*   Data
*/

import DAO from 'lib/data/overview';


/*
*   React Components
*/

import Matches from './Matches';
import Worlds from './Worlds';





/*
*
*   Component Globals
*
*/


const REGIONS = {
    1: {label: 'NA', id: '1'},
    2: {label: 'EU', id: '2'},
};



/*
*
*   Redux Helpers
*
*/
const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        world: state.world,
    };
};




/*
*
*   Component Definition
*
*/

class Overview extends React.Component {
    static propTypes = {
        lang: React.PropTypes.object.isRequired,
    };



    constructor(props) {
        super(props);

        this.dao = new DAO({
            onMatchData: this.onMatchData.bind(this),
        });


        this.state = {
            matchData: {},
        };
    }



    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.isNewMatchData(nextState)
            || this.isNewLang(nextProps)
        );
    }

    isNewMatchData(nextState) {
        return getLastmod(this.state.matchData) !== getLastmod(nextState.matchData);
    }

    isNewLang(nextProps) {
        return (this.props.lang.name !== nextProps.lang.name);
    }



    componentWillMount() {
        setPageTitle(this.props.lang);
    }



    componentDidMount() {
        this.dao.init(this.props.lang);
    }



    componentWillReceiveProps(nextProps) {
        if (this.props.lang.name !== nextProps.lang.name) {
            setPageTitle(nextProps.lang);
        }
    }



    componentWillUnmount() {
        this.dao.close();
    }



    render() {
        return (
            <div id='overview'>

                <div className='row'>
                    {_.map(REGIONS, (region, regionId) =>
                        <div className='col-sm-12' key={regionId}>
                            <Matches
                                lang={this.props.lang}
                                matches={_.filter(this.state.matchData, match => match.region === regionId)}
                                region={region}
                            />
                        </div>
                    )}
                </div>

                <hr />

                <div className='row'>
                    {_.map(REGIONS, (region, regionId) =>
                        <div className='col-sm-12' key={regionId}>
                            <Worlds
                                lang={this.props.lang}
                                region={region}
                            />
                        </div>
                    )}
                </div>

            </div>
        );
    }



    /*
    *
    *   Data Listeners
    *
    */

    onMatchData(matchData) {
        this.setState({matchData});
    }
}

Overview = connect(
  mapStateToProps,
  // mapDispatchToProps
)(Overview);


function getLastmod(matchData) {
    return _.reduce(
        matchData,
        (acc, match) => Math.max(match.lastmod),
        0
    );
}





/*
*
*   Direct DOM Manipulation
*
*/

function setPageTitle(lang) {
    let title = ['gw2w2w.com'];

    if (lang.slug !== 'en') {
        title.push(lang.name);
    }

    document.title = title.join(' - ');
}





/*
*
*   Export Module
*
*/

export default Overview;
