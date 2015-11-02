
import React from 'react';
import moment from'moment';

import STATIC from 'lib/static';

import Sprite from 'common/icons/Sprite';
import ObjectiveIcon from 'common/icons/Objective';


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
                        <li className='log-sprite'><ObjectiveIcon color={entry.owner} type={entry.type} /></li>
                        <li className='log-time'>{
                            (moment().diff(entry.lastFlipped, 'hours') < 4)
                                ? entry.lastFlipped.format('hh:mm:ss')
                                : entry.lastFlipped.fromNow(true)
                        }</li>
                        <li className='log-name'>{STATIC.objectives[entry.id].name[lang.slug]}</li>
                        <li className='log-claimed'>{
                            entry.lastClaimed.isValid()
                                ? entry.lastClaimed.format('hh:mm:ss')
                                : null
                        }</li>
                        <li className='log-guild'>{
                            entry.guild
                                ? <a href={'#' + entry.guild}>
                                    <img src={`http://guilds.gw2w2w.com/${entry.guild}.svg`} />
                                    {guilds[entry.guild]
                                        ? <span> {guilds[entry.guild].name} [{guilds[entry.guild].tag}] </span>
                                        : <i className='fa fa-spinner fa-spin'></i>
                                    }
                                </a>
                                : null
                        }</li>
                    </ul>
                </li>
            )
        .value()}
    </ol>
);





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