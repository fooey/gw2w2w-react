import React from 'react';

import _ from 'lodash';
import classnames from 'classnames';
import moment from'moment';

import Emblem from 'common/icons/Emblem';
import Arrow from 'common/icons/Arrow';
import ObjectiveIcon from 'common/icons/Objective';

import * as STATIC from 'lib/static';


export default ({
    id,
    guilds,
    lang,
    direction,
    matchMap,
    now,
}) => {
    const objectiveId = `${matchMap.id}-${id}`;
    const oMeta = STATIC.objectives[objectiveId];
    const mo = _.find(matchMap.objectives, o => o.id === objectiveId);


    return (
        <ul className={classnames({
            'list-unstyled': true,
            'track-objective': true,
            fresh: now.diff(mo.lastFlipped, 'seconds') < 30,
            expiring: mo.expires.isAfter(now) && mo.expires.diff(now, 'seconds') < 30,
            expired: now.isAfter(mo.expires),
            active: now.isBefore(mo.expires),
        })}>
            <li className='left'>
                <span className='track-geo'><Arrow direction={direction} /></span>
                <span className='track-sprite'><ObjectiveIcon color={mo.owner} type={mo.type} /></span>
                <span className='track-name'>{oMeta.name[lang.slug]}</span>
            </li>
            <li className='right'>
                {mo.guild
                    ? <a
                        className='track-guild'
                        href={'#' + mo.guild}
                        title={guilds[mo.guild] ? `${guilds[mo.guild].name} [${guilds[mo.guild].tag}]` : 'Loading...'}
                    >
                        <Emblem guildId={mo.guild} />

                    </a>
                    : null
                }
                <span className='track-expire'>
                    {mo.expires.isAfter(now)
                        ? moment(mo.expires.diff(now, 'milliseconds')).format('m:ss')
                        : null
                    }
                </span>
            </li>
        </ul>
    );
};