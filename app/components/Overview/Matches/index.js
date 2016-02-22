
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import Match from './Match';


const loadingHtml = <span style={{ paddingLeft: '.5em' }}><i className='fa fa-spinner fa-spin' /></span>;




/*
*
*   Redux Helpers
*
*/

const regionSelector = (state, props) => props.region;
const matchesSelector = (state) => {
    return (Immutable.Map.isMap(state.matches) && state.matches.has('data'))
        ? state.matches.get('data')
        : Immutable.Map();
};

const regionMatchesSelector = createSelector(
    regionSelector,
    matchesSelector,
    (region, matches) => matches.filter(match => region.id === match.get('region'))
);

const mapStateToProps = createSelector(
    regionMatchesSelector,
    regionSelector,
    (matches, region) => ({
        matches,
        region,
    })
);

// const mapStateToProps = (state, props) => {
//     return {
//         matchIds: _.filter(
//             state.matches.ids,
//             id => props.region.id === id.charAt(0)
//         ),
//     };
// };





class Matches extends React.Component {
    static propTypes = {
        matches: ImmutablePropTypes.map.isRequired,
        region: React.PropTypes.object.isRequired,
    };

    shouldComponentUpdate(nextProps) {
        const shouldUpdate = (
            !this.props.matches.equals(nextProps.matches)
        );

        // console.log('Overview::Matches::shouldUpdate', shouldUpdate);

        return shouldUpdate;
    }

    render() {
        const {
            matches,
            region,
        } = this.props;

        return (
            <div className='RegionMatches'>
                <h2>
                    {region.label} Matches
                    {matches.isEmpty() ? loadingHtml : null}
                </h2>

                {matches.map(
                    (match, matchId) =>
                    <Match key={matchId} match={match} />
                )}
            </div>
        );
    }
};
Matches = connect(
    mapStateToProps
)(Matches);

export default Matches;