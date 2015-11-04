
import React from 'react';
import moment from'moment';

import STATIC from 'lib/static';

import Emblem from 'common/icons/Emblem';
// import Sprite from 'common/icons/Sprite';
import ObjectiveIcon from 'common/icons/Objective';
import ArrowIcon from 'common/icons/Arrow';


export default ({
    guilds,
    lang,
    log,
    now,
    mapFilter,
    typeFilter,
}) => (
    <ol id='log' className='list-unstyled'>
        {_.chain(log)
            .filter(entry => byType(typeFilter, entry))
            .filter(entry => byMapId(mapFilter, entry))
            .map(entry =>
                <li key={entry.id} className={`team ${entry.owner}`}>
                    <ul className='list-unstyled log-objective'>
                        <li className='log-expire'>{
                            entry.expires.isAfter(now)
                            ? moment(entry.expires.diff(now, 'milliseconds')).format('m:ss')
                            : null
                        }</li>
                        <li className='log-time'>{
                            (moment().diff(entry.lastFlipped, 'hours') < 4)
                                ? entry.lastFlipped.format('hh:mm:ss')
                                : entry.lastFlipped.fromNow(true)
                        }</li>
                        <li className='log-geo'><ArrowIcon direction={getObjectiveDirection(entry)} /></li>
                        <li className='log-sprite'><ObjectiveIcon color={entry.owner} type={entry.type} /></li>
                        {(mapFilter === '') ? <li className='log-map'>{getMap(entry).abbr}</li> : null}
                        <li className='log-name'>{STATIC.objectives[entry.id].name[lang.slug]}</li>
                        {/*<li className='log-claimed'>{
                            entry.lastClaimed.isValid()
                                ? entry.lastClaimed.format('hh:mm:ss')
                                : null
                        }</li>*/}
                        <li className='log-guild'>{
                            entry.guild
                                ? <a href={'#' + entry.guild}>
                                    <Emblem guildId={entry.guild} />
                                    {guilds[entry.guild] ? <span className='guild-name'> {guilds[entry.guild].name} </span> :  null}
                                    {guilds[entry.guild] ? <span className='guild-tag'> [{guilds[entry.guild].tag}] </span> :  null}
                                </a>
                                : null
                        }</li>
                    </ul>
                </li>
            )
        .value()}
    </ol>
);


function getObjectiveDirection(objective) {
    const baseId = objective.id.split('-')[1].toString();
    const meta = STATIC.objectivesMeta[baseId];

    return meta.direction;
}


function getMap(objective) {
    const mapId = objective.id.split('-')[0];
    return _.find(STATIC.mapsMeta, mm => mm.id == mapId);
}




function byType(typeFilter, entry) {
    return typeFilter[entry.type];
}


function byMapId(mapFilter, entry) {
    if (mapFilter) {
        return entry.mapId === mapFilter;
    }
    else {
        return true;
    }
}