import React from 'react';
import { connect } from 'react-redux';
// import { createSelector } from 'reselect';
import {
    createImmutableSelector,
    mapImmutableSelectorsToProps,
} from 'lib/reduxHelpers';

import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import moment from 'moment';

import * as STATIC from 'lib/static';

import ObjectiveName from 'components/common/objectives/Name';
import ObjectiveArrow from 'components/common/objectives/Arrow';

import Emblem from 'components/common/icons/Emblem';
// import Sprite from 'components/common/icons/Sprite';
import ObjectiveIcon from 'components/common/icons/Objective';




/*
*   Redux / Reselect
*/

const objectiveIdSelector = (state, props) => props.id;

const langSelector = (state) => state.lang;
const nowSelector = (state) => state.now;
const guildsSelector = (state) => state.guilds;
const objectivesSelector = (state) => state.objectives;

const objectiveSelector = createImmutableSelector(
    objectiveIdSelector,
    objectivesSelector,
    (id, objectives) => objectives.get(id)
);

const hasBuffSelector = createImmutableSelector(
    nowSelector,
    objectiveSelector,
    (now, objective) => (objective.get('expires').diff() > -2000)
);

const guildIdSelector = createImmutableSelector(
    objectiveSelector,
    (objective) => objective.get('guild')
);

const guildSelector = createImmutableSelector(
    guildsSelector,
    guildIdSelector,
    (guilds, guildId) => guilds.get(guildId, Immutable.Map())
);

const mapStateToProps = mapImmutableSelectorsToProps({
    guild: guildSelector,
    hasBuff: hasBuffSelector,
    id: objectiveIdSelector,
    lang: langSelector,
    now: nowSelector,
    objective: objectiveSelector,
});





/*
*   Component
*/

class Entry extends React.Component {
    static propTypes = {
        hasBuff : React.PropTypes.bool.isRequired,
        id : React.PropTypes.string.isRequired,
        lang : ImmutablePropTypes.map.isRequired,
        now : React.PropTypes.object.isRequired,
        objective : ImmutablePropTypes.map.isRequired,

        guild : React.PropTypes.object,
        guildId : React.PropTypes.string,
    };



    shouldComponentUpdate(nextProps) {
        const {
            hasBuff,
            guild,
            lang,
            objective,
            now,
        } = this.props;

        const shouldUpdate = (
            (hasBuff && !now.isSame(nextProps.now))
            || !guild.equals(nextProps.guild)
            || !lang.equals(nextProps.lang)
            || !objective.equals(nextProps.objective)
        );

        return shouldUpdate;
    }



    render() {
        const {
            // hasBuff,
            id,
            lang,
            now,
            objective,
            guild,
        } = this.props;

        const lastFlipped = objective.get('lastFlipped');
        const expires = objective.get('expires');
        // const lastClaimed = objective.get('lastClaimed');
        // const lastmod = objective.get('lastmod');

        return (
            <li className={`team ${ objective.get('owner') }`}>
                <ul className='list-unstyled log-objective'>
                    <li className='log-expire'><TimeRemaining expires={expires} /></li>
                    <li className='log-time'><TimeStamp time={lastFlipped} /></li>
                    <li className='log-geo'><ObjectiveArrow id={id} /></li>
                    <li className='log-sprite'><ObjectiveIcon color={objective.get('owner')} type={objective.get('type')} /></li>
                    <li className='log-name'><ObjectiveName id={id} lang={lang} /></li>
                    <li className='log-guild'><ObjectiveGuild objective={objective} guild={guild} /></li>
                </ul>
            </li>
        );
    }
};

Entry = connect(
  mapStateToProps
)(Entry);



const TimeRemaining = ({ expires }) => (
    <span>{
        expires.isAfter()
            ? moment(expires.diff(Date.now(), 'milliseconds')).format('m:ss')
            : null
    }</span>
);

const TimeStamp = ({ time, maxAge = 1 }) => (
    <span>{
        (moment().diff(time, 'hours') < maxAge)
            ? time.format('hh:mm:ss')
            : time.fromNow(true)
    }</span>
);

const ObjectiveGuild = ({ objective, guild }) => (
    <span>{
        (objective.get('guild'))
            ? <a href={'#' + objective.get('guild')}>
                <Emblem guildId={objective.get('guild')} />
                {guild ? <span className='guild-name'> {guild.get('name')} </span> :  null}
                {guild ? <span className='guild-tag'> [{guild.get('tag')}] </span> :  null}
            </a>
            : null
    }</span>
);



function getMap(objective) {
    const mapId = objective.id.split('-')[0];
    return _.find(STATIC.mapsMeta, mm => mm.id == mapId);
}


export default Entry;