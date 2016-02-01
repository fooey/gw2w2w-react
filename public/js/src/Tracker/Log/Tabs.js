
import React from'react';
import classnames from'classnames';
import ObjectiveIcon from 'common/icons/Objective';

import * as STATIC from 'lib/static';


export default ({
    maps,
    mapFilter = '',
    typeFilter = '',

    handleMapFilterClick,
    handleTypeFilterClick,
}) => {
    return (
        <div id='log-tabs' className='flex-tabs'>
            <a
                className={classnames({tab: true, active: !mapFilter})}
                onClick={() => handleMapFilterClick('')}
                children={'All'}
            />
            {_.map(
                STATIC.mapsMeta,
                (mm) => (
                    (_.some(maps, matchMap => matchMap.id == mm.id))
                        ? <a
                            key={mm.id}
                            className={classnames({tab: true, active: mapFilter == mm.id})}
                            onClick={() => handleMapFilterClick(_.parseInt(mm.id))}
                            title={mm.name}
                            children={mm.abbr}
                        />
                        : null
                )
            )}
            {_.map(
                ['castle', 'keep', 'tower', 'camp'],
                t =>
                <a  key={t}
                    className={classnames({
                        check: true,
                        active: typeFilter[t],
                        first: t === 'castle',
                    })}
                    onClick={() => handleTypeFilterClick(t)} >

                    <ObjectiveIcon type={t} size={18} />

                </a>
            )}
        </div>
    );
};