
import React from'react';

import * as STATIC from 'lib/static';

import ArrowIcon from 'components/common/icons/Arrow';



const ObjectiveArrow = ({
    id,
}) => (
    <ArrowIcon direction={ getObjectiveDirection(id) } />
);



function getObjectiveDirection(id) {
    const baseId = id.split('-')[1].toString();
    const meta = STATIC.objectivesMeta[baseId];

    return meta.direction;
}

export default ObjectiveArrow;