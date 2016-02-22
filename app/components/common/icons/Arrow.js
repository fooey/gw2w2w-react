
import React from'react';






const Arrow = ({ direction }) => (
    (direction)
        ? <img src={getArrowSrc(direction)} className='arrow' />
        : <span />
);





/*
 *
 * Private Methods
 *
 */

function getArrowSrc(direction) {
    const src = ['/img/icons/dist/arrow'];

    if (!direction) {
        return null;
    }


    if (direction.indexOf('N') >= 0) {
        src.push('north');
    }
    else if (direction.indexOf('S') >= 0) {
        src.push('south');
    }

    if (direction.indexOf('W') >= 0) {
        src.push('west');
    }
    else if (direction.indexOf('E') >= 0) {
        src.push('east');
    }


    return src.join('-') + '.svg';
}


export default Arrow;