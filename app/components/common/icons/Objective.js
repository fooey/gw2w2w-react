
import React from'react';



const Objective = ({
    color = 'black',
    type,
    size,
}) => {
    let src = '/img/icons/dist/';
    src += type;
    if (color !== 'black') {
        src += '-' + color;
    }
    src += '.svg';

    return <img
        src={src}
        className={`icon-objective icon-objective-${type}`}
        width={size ? size: null}
        height={size ? size: null}
    />;
};

export default Objective;