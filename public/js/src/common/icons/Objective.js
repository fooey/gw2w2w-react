
import React from'react';



export default ({
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