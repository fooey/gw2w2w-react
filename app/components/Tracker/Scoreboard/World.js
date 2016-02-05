
import React from 'react';
import _ from 'lodash';
import numeral from 'numeral';

import Holdings from './Holdings';


import {worlds as WORLDS} from 'lib/static';


const Loading = () => (
    <h1 style={{height: '90px', fontSize: '32pt', lineHeight: '90px'}}>
        <i className='fa fa-spinner fa-spin'></i>
    </h1>
);




export default ({
    color,
    deaths,
    id,
    holdings,
    kills,
    lang,
    score,
    tick,
}) => {
    const world = WORLDS[id][lang.slug];

    if (!world && _.isEmpty(world)) {
        return <Loading />;
    }

    return (
        <div className={`scoreboard team-bg team text-center ${color}`}>
            <h1><a href={world.link}>{world.name}</a></h1>
            <h2>
                <div className='stats'>
                    <span title='Total Score'>{numeral(score).format('0,0')}</span>
                    {' '}
                    <span title='Total Tick'>{numeral(tick).format('+0,0')}</span>
                </div>
                {kills
                    ? <div className='sub-stats'>
                        <span title='Total Kills'>{numeral(kills).format('0,0')}k</span>
                        {' '}
                        <span title='Total Deaths'>{numeral(deaths).format('0,0')}d</span>
                    </div>
                    : null
                }
            </h2>

            <Holdings
                color={color}
                holdings={holdings}
            />
        </div>
    );
};
