
import React from 'react';
import _ from 'lodash';

import World from './World';





/*
*
* Component Definition
*
*/

export default ({
    match,
    lang,
}) =>  {
    const worldsProps = getWorldsProps(match, lang);

    return (
        <section className='row' id='scoreboards'>
            {_.map(
                worldsProps,
                (worldProps) =>
                <div className='col-sm-8' key={worldProps.id}>
                    <World {...worldProps} />
                </div>
            )}
        </section>
    );
};


function getWorldsProps(match, lang) {
    return _.reduce(
        match.worlds,
        (acc, worldId, color) => {
            acc[color] = {
                color,
                lang,
                id: worldId,
                score: _.get(match, ['scores', color], 0),
                deaths: _.get(match, ['deaths', color], 0),
                kills: _.get(match, ['kills', color], 0),
                tick: _.get(match, ['ticks', color], 0),
                holdings: _.get(match, ['holdings', color], []),
            };
            return acc;
        },
        {red: {}, blue: {}, green: {}}
    );
}