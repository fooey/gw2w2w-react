import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Emblem from 'components/common/icons/Emblem';


export default ({
    guilds,
}) => (
    <ul id='guilds' className='list-unstyled'>
        {_
            .chain(guilds)
            .sortBy('name')
            .map(
                guild =>
                <li key={guild.id} className='guild' id={guild.id}>
                    <a href={`https://guilds.gw2w2w.com/${guild.id}`}>
                        <Emblem guildId={guild.id} />
                        <div>
                            <span className='guild-name'> {guild.name} </span>
                            <span className='guild-tag'> [{guild.tag}] </span>
                        </div>
                    </a>
                </li>
            )
        .value()}
    </ul>
);

