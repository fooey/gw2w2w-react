
/*
*
*   Dependencies
*
*/

import React from 'react';
import { connect } from 'react-redux';


/*
*   Redux Actions
*/

import * as apiActions from 'actions/api';
import * as timeoutActions from 'actions/timeouts';


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
    1: { label: 'NA', id: '1' },
    2: { label: 'EU', id: '2' },
};



/*
*
*   Redux Helpers
*
*/

const mapStateToProps = (state) => {

    // console.log('state', state.timeouts);

    return {
        lang: state.lang,
        matchesData: state.matches.data,
        matchesLastUpdated: state.matches.lastUpdated,
        matchesIsFetching: _.includes(state.api.pending, 'matches'),
        // timeouts: state.timeouts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMatches: () => dispatch(apiActions.fetchMatches()),
        setAppTimeout: ({ name, cb, timeout }) => dispatch(timeoutActions.setAppTimeout({ name, cb, timeout })),
        clearAppTimeout: ({ name }) => dispatch(timeoutActions.clearAppTimeout({ name })),
        // clearAllTimeouts: () => dispatch(timeoutActions.clearAllTimeouts()),
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
        matchesData: React.PropTypes.object.isRequired,
        matchesLastUpdated: React.PropTypes.number.isRequired,
        matchesIsFetching: React.PropTypes.bool.isRequired,
        // timeouts: React.PropTypes.object.isRequired,

        fetchMatches: React.PropTypes.func.isRequired,

        setAppTimeout: React.PropTypes.func.isRequired,
        clearAppTimeout: React.PropTypes.func.isRequired,
    };



    constructor(props) {
        super(props);
    }



    shouldComponentUpdate(nextProps/*, nextState*/) {
        const shouldUpdate = (
            this.props.matchesLastUpdated !== nextProps.matchesLastUpdated
            || this.props.matchesIsFetching !== nextProps.matchesIsFetching
            || this.props.lang.slug !== nextProps.lang.slug
        );

        // console.log(`Overview::shouldUpdate`, this.props, nextProps);

        // console.log(`Overview::shouldUpdate`, shouldUpdate);
        // console.log(`Overview::isNewMatchesData`, this.isNewMatchesData(nextProps));
        // console.log(`Overview::isNewLang`, this.isNewLang(nextProps));

        return shouldUpdate;
    }



    componentWillMount() {
        // console.log(`Overview::componentWillMount()`);

        setPageTitle(this.props.lang);
    }



    componentDidMount() {
        // console.log(`Overview::componentDidMount()`);

        this.props.fetchMatches();
    }



    componentWillReceiveProps(nextProps) {
        // console.log(`Overview::componentWillReceiveProps()`);

        const {
            lang,
            matchesIsFetching,
            fetchMatches,
            setAppTimeout,
        } = this.props;

        if (lang.name !== nextProps.lang.name) {
            setPageTitle(nextProps.lang);
        }

        if (matchesIsFetching && !nextProps.matchesIsFetching) {
            setAppTimeout({
                name: 'fetchMatches',
                cb: () => fetchMatches(),
                timeout: () => _.random(4 * 1000, 8 * 1000),
            });
        }
    }



    componentWillUnmount() {
        // console.log(`Overview::componentWillUnmount()`);

        this.props.clearAppTimeout({ name: 'fetchMatches' });
    }



    render() {
        return (
            <div id='overview'>

                {/* matches */}
                <div className='row'>
                    {_.map(REGIONS, (region) =>
                        <div className='col-sm-12' key={region.id}>
                            <Matches region={region} />
                        </div>
                    )}
                </div>

                <hr />

                {/* worlds */}
                <div className='row'>
                    {_.map(REGIONS, (region) =>
                        <div className='col-sm-12' key={region.id}>
                            <Worlds region={region} />
                        </div>
                    )}
                </div>

            </div>
        );
    }
}

Overview = connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);





/*
*
*   Direct DOM Manipulation
*
*/

function setPageTitle(lang) {
    const title = ['gw2w2w.com'];

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
