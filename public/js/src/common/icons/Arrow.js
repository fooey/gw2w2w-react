
import React from'react';






export default ({direction}) => (
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
    if (!direction) {
        return null;
    }

    let src = ['/img/icons/dist/arrow'];

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