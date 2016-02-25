
import React from'react';



const Objective = ({
    color = 'black',
    type,
    size,
}) => (
    <img
        src={getSrc({ color, type })}
        className={getClass({ type })}
        width={size ? size : null}
        height={size ? size : null}
    />
);



function getSrc({ color, type }) {
    let src = '/img/icons/dist/';

    src += type;

    if (color !== 'black') {
        src += '-' + color;
    }

    src += '.svg';

    return src;
}



function getClass({ type }) {
    return `icon-objective icon-objective-${type}`;
}



export default Objective;