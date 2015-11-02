
import React from 'react';

import Sprite from 'common/Icons/Sprite';





export default ({
    color,
    holdings,
}) => (
    <ul className='list-inline'>
        {_.map(holdings, (typeQuantity, typeIndex) =>
            <li key={typeIndex}>
                <Sprite
                    type  = {typeIndex}
                    color = {color}
                />

                <span className='quantity'>x{typeQuantity}</span>
            </li>
        )}
    </ul>
);
