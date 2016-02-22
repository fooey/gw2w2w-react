
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import Pie from 'components/common/Icons/Pie';






/*
*
*   Redux Helpers
*
*/
// const mapStateToProps = (state, props) => {
//     return {
//         matchId: props.matchId,
//         scores: (Immutable.Map.isMap(state.matches))
//             ? state.matches.getIn(['data', props.matchId, 'scores'])
//             : Immutable.Map({ red: 0, blue: 0, green: 0 }),
//     };
// };

const matchIdSelector = (state, props) => props.matchId;
const scoresSelector = (state, props) => (
    (Immutable.Map.isMap(state.matches))
    ? state.matches.getIn(['data', props.matchId, 'scores'])
    : Immutable.Map({ red: 0, blue: 0, green: 0 })
);

const mapSelectorsToProps = createSelector(
    scoresSelector,
    matchIdSelector,
    (scores, matchId) => ({
        scores,
        matchId,
    })
);


class MatchPie extends React.Component {
    static propTypes = {
        scores: ImmutablePropTypes.map.isRequired,
        matchId: React.PropTypes.string.isRequired,
    };

    shouldComponentUpdate(nextProps) {
        return !this.props.scores.equals(nextProps.scores);
    }

    render() {
        const {
            scores,
            matchId,
        } = this.props;

        // console.log(matchId, scores.toJS());

        return (
            <Pie scores={scores.toJS()} size={60} />
        );
    }
};

MatchPie = connect(
    mapSelectorsToProps
)(MatchPie);



export default MatchPie;