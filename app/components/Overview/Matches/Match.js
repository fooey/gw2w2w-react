
import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import _ from 'lodash';

import MatchWorld from './MatchWorld';

import { worlds } from 'lib/static';
const WORLD_COLORS = ['red', 'blue', 'green'];



/*
*
*   Redux Helpers
*
*/

// const mapToProps = (state, props) => {
//     return {
//         lang: state.lang,
//         // match: state.matches.getIn(['data', props.matchId]),
//         match: (Immutable.Map.isMap(state.matches))
//             ? state.matches.getIn(['data', props.matchId])
//             : Immutable.Map({  }),
//     };
// };

const langSelector = (state) => state.lang;
const matchSelector = (state, props) => props.match;

// const matchSelector = createSelector(
//     matchIdSelector,
//     matchesSelector,
//     (matchId, matches) => matches.get(matchId)
// );

const mapToProps = createSelector(
    langSelector,
    matchSelector,
    (lang, match) => ({ lang, match })
);



class Match extends React.Component {
    static propTypes = {
        lang: ImmutablePropTypes.map.isRequired,
        match: ImmutablePropTypes.map.isRequired,
    };



    shouldComponentUpdate(nextProps) {
        return (
            this.isNewMatchData(nextProps)
            || this.isNewLang(nextProps)
        );
    }

    isNewMatchData(nextProps) {
        return !this.props.match.equals(nextProps.match);
    }

    isNewLang(nextProps) {
        return !this.props.lang.equals(nextProps.lang);
    }



    render() {
        const {
            lang,
            match,
        } = this.props;
        // console.log('match', match.get('id'), match.toJS());

        return (
            <div className='matchContainer'>
                <table className='match'>
                    <tbody>
                        {_.map(WORLD_COLORS, (color) => {
                            const worldId  = match.getIn(['worlds', color]);

                            return (
                                <MatchWorld
                                    component = 'tr'
                                    key = {worldId}

                                    color = {color}
                                    match = {match}
                                    showPie = {color === 'red'}
                                    worldId = {worldId}
                                />
                            );
                        })}
                        {/*<tr>
                            <td colSpan={2} />
                            <td style={{textAlign: 'center'}}>
                                <small>{moment(match.lastmod * 1000).format('hh:mm:ss')}</small>
                            </td>
                        </tr>*/}
                    </tbody>
                </table>
            </div>
        );
    }
}

Match = connect(
    mapToProps,
)(Match);


export default Match;