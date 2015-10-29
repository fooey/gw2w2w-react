
import React from 'react';

import {worlds} from 'lib/static';




/*
*
* Component Definition
*
*/

export default ({
    lang,
    region,
}) => (
    <div className='RegionWorlds'>
        <h2>{region.label} Worlds</h2>
        <ul className='list-unstyled'>
            {_.chain(worlds)
                .filter(world => world.region === region.id)
                .map(world => world[lang.slug])
                .sortBy('name')
                .map(world => <li key={world.slug}><a href={world.link}>{world.name}</a></li>)
                .value()
            }
        </ul>
    </div>
);