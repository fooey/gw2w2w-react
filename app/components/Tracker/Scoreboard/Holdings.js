
import React from 'react';

import Sprite from 'components/common/Icons/Sprite';





const Holdings = ({
    color,
    holdings,
}) => (
    <ul className='list-inline'>
        {holdings.map(
            (typeQuantity, typeIndex) =>
            <li key={typeIndex}>
                <Sprite
                    type = {typeIndex}
                    color = {color}
                />

                <span className='quantity'>x{typeQuantity}</span>
            </li>
        )}
    </ul>
);


export default Holdings;