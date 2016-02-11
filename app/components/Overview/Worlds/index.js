
import React from 'react';
import { connect } from 'react-redux';

import { worlds } from 'lib/static';






const mapStateToProps = (state) => {
    return {
        lang: state.lang,
    };
};


let Worlds = ({
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
Worlds.propTypes = {
    lang: React.PropTypes.object.isRequired,
    region: React.PropTypes.object.isRequired,
};

Worlds = connect(mapStateToProps)(Worlds);


export default Worlds;