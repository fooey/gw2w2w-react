
import React from'react';



export default ({
    color = 'black',
    type,
}) => {
    let src = '/img/icons/dist/';
    src += type;
    if (color !== 'black') {
        src += '-' + color;
    }
    src += '.svg';

    return <img src={src} className={`icon-objective icon-objective-${type}`} />;
};