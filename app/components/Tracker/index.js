
/*
*
* Dependencies
*
*/

import React from'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { createImmutableSelector } from 'lib/redux';

import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import _ from'lodash';
import moment from'moment';


/*
*   Redux Actions
*/

import * as apiActions from 'actions/api';
import * as timeoutActions from 'actions/timeouts';
import * as nowActions from 'actions/now';



/*
 *   Data
 */

// import DAO from 'lib/data/tracker';



/*
 * React Components
 */

import Scoreboard from './Scoreboard';
import Maps from './Maps';
import Log from './Log';
import Guilds from './Guilds';




/*
* Globals
*/

const MATCH_REFRESH = _.random(4 * 1000, 8 * 1000);
const TIME_REFRESH = 1000 / 1;

// const LoadingSpinner = () => (
//     <h1 id='AppLoading'>
//         <i className='fa fa-spinner fa-spin'></i>
//     </h1>
// );





/*
*
*   Redux Helpers
*
*/
// const mapStateToProps = (state) => {
//     return {
//         lang: state.lang,
//         world: state.world,
//         guilds: state.guilds,
//         // timeouts: state.timeouts,
//     };
// };
const apiSelector = (state) => state.api;
const langSelector = (state) => state.lang;
// const nowSelector = (state) => state.now;
// const matchDetailsSelector = (state) => state.matchDetails;
// const guildsSelector = (state) => state.guilds;
const worldSelector = (state) => state.world;

const detailsIsFetchingSelector = createImmutableSelector(
    apiSelector, (api) => api.get('pending').includes('matchDetails')
);

const mapStateToProps = createImmutableSelector(
    langSelector,
    // nowSelector,
    // guildsSelector,
    // matchDetailsSelector,
    worldSelector,
    detailsIsFetchingSelector,
    (
        lang,
        // now,
        // guilds,
        // matchDetails,
        world,
        detailsIsFetching
    ) => ({
        lang,
        // now,
        // guilds,
        // matchDetails,
        world,
        detailsIsFetching,
    })
);

const mapDispatchToProps = (dispatch) => {
    return {
        setNow: () => dispatch(nowActions.setNow()),

        fetchGuildById: (id) => dispatch(apiActions.fetchGuildById(id)),
        fetchMatchDetails: (worldId) => dispatch(apiActions.fetchMatchDetails(worldId)),

        setAppTimeout: ({ name, cb, timeout }) => dispatch(timeoutActions.setAppTimeout({ name, cb, timeout })),
        clearAppTimeout: ({ name }) => dispatch(timeoutActions.clearAppTimeout({ name })),
    };
};




/*
*
* Component Export
*
*/


class Tracker extends React.Component {
    static propTypes={
        lang : ImmutablePropTypes.map.isRequired,
        world: React.PropTypes.object.isRequired,
        detailsIsFetching: React.PropTypes.bool.isRequired,
        // guilds : ImmutablePropTypes.map.isRequired,
        // matchDetails : ImmutablePropTypes.map.isRequired,

        setNow: React.PropTypes.func.isRequired,
        // now: React.PropTypes.object.isRequired,

        fetchGuildById: React.PropTypes.func.isRequired,
        fetchMatchDetails: React.PropTypes.func.isRequired,

        setAppTimeout: React.PropTypes.func.isRequired,
        clearAppTimeout: React.PropTypes.func.isRequired,
    };

    /*
    *
    *     React Lifecycle
    *
    */

    constructor(props) {
        super(props);
    }



    componentDidMount() {
        // console.log('Tracker::componentDidMount()');

        const {
            lang,
            world,
            fetchMatchDetails,
        } = this.props;

        setPageTitle(lang, world);
        fetchMatchDetails({ world });

        this.updateNow();
    }

    updateNow() {
        this.props.setAppTimeout({
            name: 'setNow',
            cb: () => {
                this.props.setNow();
                this.updateNow();
            },
            timeout: TIME_REFRESH,
        });
    }



    componentWillMount() {
        // console.log(`Tracker::componentWillMount()`);
        // setPageTitle(this.props.lang);
    }



    componentWillReceiveProps(nextProps) {
        const {
            lang,
            world,

            detailsIsFetching,

            fetchMatchDetails,
            setAppTimeout,
        } = this.props;

        if (!lang.equals(nextProps.lang) || world.slug !== nextProps.world.slug) {
            setPageTitle(nextProps.lang, nextProps.world);
        }

        if (detailsIsFetching && !nextProps.detailsIsFetching) {
            setAppTimeout({
                name: 'fetchMatchDetails',
                cb: () => fetchMatchDetails({ world }),
                timeout: () => MATCH_REFRESH,
            });
        }
    }



    shouldComponentUpdate(nextProps) {
        return (
            this.isNewLang(nextProps)
            // || this.isNewSecond(nextProps)
        );
    }

    isNewSecond(nextProps) {
        return !this.props.now.isSame(nextProps.now);
    }

    isNewLang(nextProps) {
        return (!this.props.lang.equals(nextProps.lang));
    }



    componentWillUnmount() {
        this.props.clearAppTimeout({ name: 'fetchMatchDetails' });
    }



    render() {
        // console.log('Tracker::render()');


        return (
            <div id='tracker'>
                <Scoreboard />
                <Log />
                <Guilds />


                {/*
                {(match && !_.isEmpty(match))
                    ? <Maps
                        lang={lang}
                        match={match}
                        now={now}
                    />
                    : null
                }
                */}



            </div>
        );
    }

}

Tracker = connect(
  mapStateToProps,
  mapDispatchToProps
)(Tracker);




/*
*
* Private methods
*
*/



function momentNow() {
    return moment(Math.floor(Date.now() / 1000) * 1000);
}



function setPageTitle(lang, world) {
    const langSlug  = lang.get('slug');
    const worldName = world.name;

    const title     = [worldName, 'gw2w2w'];

    if (langSlug !== 'en') {
        title.push(lang.get('name'));
    }

    document.title = title.join(' - ');
}










export default Tracker;