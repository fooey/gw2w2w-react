import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Objective from './Objective';

import * as STATIC from 'lib/static';


export default ({
    guilds,
    lang,
    matchMap,
    now,
}) => {
    return (
        <div className='map-sections'>
            {_.map(
                getMapObjectivesMeta(matchMap.id),
                (section, ix) =>
                <div className={classnames({
                    'map-section': true,
                    solo: section.length === 1,
                })} key={ix}>
                    {_.map(
                        section,
                        (geo) =>
                        <Objective
                            key={geo.id}
                            id={geo.id}
                            guilds={guilds}
                            lang={lang}
                            direction={geo.direction}
                            matchMap={matchMap}
                            now={now}
                        />
                    )}
                </div>
            )}
        </div>
    );
};



function getMapObjectivesMeta(mapId) {
    let mapCode = 'bl2';

    if (mapId === 38) {
        mapCode = 'eb';
    }

    return _
        .chain(STATIC.objectivesMeta)
        .cloneDeep()
        .filter(om => om.map === mapCode)
        .groupBy(om => om.group)
        .value();
}
