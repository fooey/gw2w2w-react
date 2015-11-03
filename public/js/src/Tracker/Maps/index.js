
import React from 'react';
import _ from 'lodash';

import MatchMap from './MatchMap';

import STATIC from 'lib/static';




/*
*
* Component Definition
*
*/

export default ({
    guilds,
    lang,
    match,
    now,
}) => {

    if (_.isEmpty(match)) {
        return null;
    }

    const maps = _.indexBy(match.maps, 'id');
    const currentMapIds = _.keys(maps);
    const mapsMetaActive = _.filter(
        STATIC.mapsMeta,
        mapMeta => _.indexOf(currentMapIds, _.parseInt(mapMeta.id) !== -1)
    );

    return (
        <section id='maps'>
            {_.map(
                mapsMetaActive,
                (mapMeta) =>
                <div className='map' key={mapMeta.id}>
                    <h2>{mapMeta.name}</h2>
                    <MatchMap
                        guilds={guilds}
                        lang={lang}
                        mapMeta={mapMeta}
                        matchMap={maps[mapMeta.id]}
                        now={now}
                    />
                </div>
            )}
        </section>
    );
};





/*


                    <div className='col-md-6'>{<MapDetails mapKey='Center' mapMeta={getMapMeta('Center')} {...this.props} />}</div>

                    <div className='col-md-18'>

                        <div className='row'>
                            <div className='col-md-8'>{<MapDetails mapKey='RedHome' mapMeta={getMapMeta('RedHome')} {...this.props} />}</div>
                            <div className='col-md-8'>{<MapDetails mapKey='BlueHome' mapMeta={getMapMeta('BlueHome')} {...this.props} />}</div>
                            <div className='col-md-8'>{<MapDetails mapKey='GreenHome' mapMeta={getMapMeta('GreenHome')} {...this.props} />}</div>
                        </div>

                    </div>
                 </div>
                 */