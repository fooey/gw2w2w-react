import React from 'react';
import { connect } from 'react-redux';
// import { createSelector } from 'reselect';
import { createImmutableSelector } from 'lib/redux';

import Immutable from 'immutable';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import moment from 'moment';

import * as STATIC from 'lib/static';

import Emblem from 'components/common/icons/Emblem';
// import Sprite from 'components/common/icons/Sprite';
import ObjectiveIcon from 'components/common/icons/Objective';
import ArrowIcon from 'components/common/icons/Arrow';






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
const guildSelector = createImmutableSelector(
    guildsSelector,
    objectiveSelector,
    (guilds, objective) => guilds.get(
        objective.get('guild'),
        Immutable.Map()
    )
);

const mapStateToProps = createImmutableSelector(
    langSelector,
    nowSelector,
    guildSelector,
    objectiveSelector,
    objectiveIdSelector,
    (lang, now, guild, objective, id) => ({
        lang,
        now,
        guild,
        objective,
        id,
    })
);



// const mapStateToProps = (state, props) => {
//     return {
//         lang: state.lang,
//         guild: state.guilds.get(
//             props.objective.get('guild'),
//             Immutable.Map()
//         ),
//         // entries,
//         id: props.id,
//         objective: props.objective,
//     };
// };


class Entry extends React.Component {
    static propTypes = {
        id : React.PropTypes.string.isRequired,
        guild : React.PropTypes.object.isRequired,
        lang : ImmutablePropTypes.map.isRequired,
        now : React.PropTypes.object.isRequired,
        objective : ImmutablePropTypes.map.isRequired,
    };



    shouldComponentUpdate(nextProps) {
        const {
            guild,
            lang,
            now,
            objective,
        } = this.props;

        const shouldUpdate = (
            (
                !now.isSame(nextProps.now)
                && (objective.get('expires').diff() > -5000)
            )
            || !lang.equals(nextProps.lang)
            || !objective.equals(nextProps.objective)
            || !guild.equals(nextProps.guild)
        );

        return shouldUpdate;
    }



    render() {
        const {
            id,
            lang,
            now,
            objective,
            guild,
        } = this.props;

        // const lastFlipped = moment.unix(objective.get('lastFlipped'));
        // const lastClaimed = moment.unix(objective.get('lastClaimed'));
        // const lastmod = moment.unix(objective.get('lastmod'));
        // const expires = moment.unix(objective.get('expires'));

        const lastFlipped = objective.get('lastFlipped');
        const lastClaimed = objective.get('lastClaimed');
        const lastmod = objective.get('lastmod');
        const expires = objective.get('expires');

        // const expires = lastFlipped.add(5, 'm');

        // console.log(id);

        return (
            <li key={id} className={`team ${ objective.get('owner') }`}>
                {/*JSON.stringify(objective.toJS())*/}

                <ul className='list-unstyled log-objective'>
                    <li className='log-expire'>{
                        expires.isAfter()
                            ? moment(expires.diff(now, 'milliseconds')).format('m:ss')
                            : null
                    }</li>
                    <li className='log-time'>{
                        (moment().diff(lastFlipped, 'hours') < 1)
                            ? lastFlipped.format('hh:mm:ss')
                            : lastFlipped.fromNow(true)
                    }</li>
                    <li className='log-geo'><ArrowIcon direction={getObjectiveDirection(objective.get('id'))} /></li>
                    <li className='log-sprite'><ObjectiveIcon color={objective.get('owner')} type={objective.get('type')} /></li>
                    <li className='log-name'>{STATIC.objectives[id].name[lang.get('slug')]}</li>
                    <li className='log-guild'>{
                        (objective.get('guild'))
                            ? <a href={'#' + objective.get('guild')}>
                                <Emblem guildId={objective.get('guild')} />
                                {guild ? <span className='guild-name'> {guild.get('name')} </span> :  null}
                                {guild ? <span className='guild-tag'> [{guild.get('tag')}] </span> :  null}
                            </a>
                            : null
                    }</li>
                </ul>
            </li>
        );
    }
};

        // {_.map(entries, entry =>
        //     <li key={entry.id} className={`team ${entry.owner}`}>
        //         <ul className='list-unstyled log-objective'>
        //             <li className='log-expire'>{
        //                 entry.expires.isAfter(now)
        //                     ? moment(entry.expires.diff(now, 'milliseconds')).format('m:ss')
        //                     : null
        //             }</li>
        //             <li className='log-time'>{
        //                 (moment().diff(entry.lastFlipped, 'hours') < 4)
        //                     ? entry.lastFlipped.format('hh:mm:ss')
        //                     : entry.lastFlipped.fromNow(true)
        //             }</li>
        //             <li className='log-geo'><ArrowIcon direction={getObjectiveDirection(entry)} /></li>
        //             <li className='log-sprite'><ObjectiveIcon color={entry.owner} type={entry.type} /></li>
        //             {(mapFilter === '') ? <li className='log-map'>{getMap(entry).abbr}</li> : null}
        //             <li className='log-name'>{STATIC.objectives[entry.id].name[lang.get('slug')]}</li>
        //             {/*<li className='log-claimed'>{
        //                 (entry.lastClaimed.isValid())
        //                     ? entry.lastClaimed.format('hh:mm:ss')
        //                     : null
        //             }</li>*/}
        //             <li className='log-guild'>{
        //                 (entry.guild)
        //                     ? <a href={'#' + entry.guild}>
        //                         <Emblem guildId={entry.guild} />
        //                         {guild[entry.guild] ? <span className='guild-name'> {guild[entry.guild].name} </span> :  null}
        //                         {guild[entry.guild] ? <span className='guild-tag'> [{guild[entry.guild].tag}] </span> :  null}
        //                     </a>
        //                     : null
        //             }</li>
        //         </ul>
        //     </li>
        // )}

Entry = connect(
  mapStateToProps
)(Entry);


function getObjectiveDirection(id) {
    const baseId = id.split('-')[1].toString();
    const meta = STATIC.objectivesMeta[baseId];

    return meta.direction;
}


function getMap(objective) {
    const mapId = objective.id.split('-')[0];
    return _.find(STATIC.mapsMeta, mm => mm.id == mapId);
}


export default Entry;