
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import numeral from 'numeral';

import { worlds } from 'lib/static';

import MatchPie from './MatchPie';






/*
*
*   Redux Helpers
*
*/

const colorSelector = (state, props) => props.color;
const langSelector = (state) => state.lang;
const matchSelector = (state, props) => props.match;
const showPieSelector = (state, props) => props.showPie;
const worldIdSelector = (state, props) => props.worldId;

const worldSelector = createSelector(
    langSelector,
    worldIdSelector,
    (lang, worldId) => worlds[worldId][lang.get('slug')]
);
const scoresSelector = createSelector(
    matchSelector,
    (match) => match.get('scores')
);
const scoreSelector = createSelector(
    colorSelector,
    scoresSelector,
    (color, scores) => scores.get(color)
);

const mapSelectorsToProps = createSelector(
    colorSelector,
    langSelector,
    matchSelector,
    scoreSelector,
    showPieSelector,
    worldSelector,
    (color, lang, match, score, showPie, world) => ({
        color,
        lang,
        match,
        score,
        showPie,
        world,
    })
);


class MatchWorld extends React.Component {
    static propTypes = {
        color: React.PropTypes.string.isRequired,
        lang: ImmutablePropTypes.map.isRequired,
        match: ImmutablePropTypes.map.isRequired,
        score: React.PropTypes.number.isRequired,
        showPie: React.PropTypes.bool.isRequired,
        world: React.PropTypes.object.isRequired,
    };

    shouldComponentUpdate(nextProps) {
        return (
            (this.props.score !== nextProps.score)
            || (!this.props.lang.equals(nextProps.lang))
        );
    }

    render() {
        const {
            color,
            match,
            score,
            showPie,
            world,
        } = this.props;

        // console.log(world, score);

        return (
            <tr>
                <td className={`team name ${color}`}>
                    <a href={world.link}>{world.name}</a>
                </td>
                {/*<td className={`team kills ${color}`}>{match.kills ? numeral(match.kills[color]).format('0,0') : null}</td>*/}
                {/*<td className={`team deaths ${color}`}>{match.deaths ? numeral(match.deaths[color]).format('0,0') : null}</td>*/}
                <td className={`team score ${color}`}>{
                    score
                    ? numeral(score).format('0,0')
                    : null
                }</td>

                {(showPie) ? <td className='pie' rowSpan='3'><MatchPie matchId={match.get('id')} size={60} /></td> : null}
            </tr>
        );
    }
};

MatchWorld = connect(
    mapSelectorsToProps
)(MatchWorld);



export default MatchWorld;